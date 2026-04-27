#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { confirm, input, select } from '@inquirer/prompts';

const SUBMODULE_PATH = 'apps/wfo-ui';
const PACKAGE_PREFIX = '@orchestrator-ui/orchestrator-ui-components@';
const OFFICIAL_REPO_SLUG = 'workfloworchestrator/orchestrator-ui-library';
const OFFICIAL_REPO_URL = `https://github.com/${OFFICIAL_REPO_SLUG}.git`;
const DEFAULT_FORK_REPO_NAME = 'orchestrator-ui-library';
const DEFAULT_FORK_REMOTE_NAME = 'fork';
const COMMIT_MESSAGE = (version) =>
  `Deploy version ${version}: remove submodule ${SUBMODULE_PATH} and add its content directly`;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.resolve(scriptDir, '..');

process.chdir(repoDir);

function parseCliArgs(args) {
  const options = {
    quick: false,
  };

  for (const arg of args) {
    if (arg === '--quick' || arg === '-q') {
      options.quick = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/deploy.mjs [--quick|-q]

Options:
  --quick, -q  Use the default deploy path without interactive prompts
  --help, -h   Show this help message`);
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function run(command, args, options = {}) {
  const { capture = false, allowFailure = false, cwd = repoDir } = options;
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: capture ? ['inherit', 'pipe', 'pipe'] : 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !allowFailure) {
    const description = [command, ...args].join(' ');
    throw new Error(`Command failed: ${description}`);
  }

  if (capture) {
    return {
      status: result.status ?? 0,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
    };
  }

  return {
    status: result.status ?? 0,
  };
}

function git(args, options) {
  return run('git', args, options);
}

function gh(args, options) {
  return run('gh', args, options);
}

function logStep(message) {
  console.log(`\n==> ${message}`);
}

function isPromptExit(error) {
  return error && typeof error === 'object' && error.name === 'ExitPromptError';
}

function ensureInteractiveTerminal(quickMode) {
  if (quickMode) {
    return;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('This deploy command must be run in an interactive terminal.');
  }
}

function normalizeGitHubRepo(url) {
  if (!url) {
    return null;
  }

  const trimmedUrl = url.trim();
  const scpLikeMatch = trimmedUrl.match(/^(?:[^@]+@)?github\.com:(.+)$/i);

  if (scpLikeMatch) {
    return scpLikeMatch[1]
      .replace(/\/$/, '')
      .replace(/\.git$/i, '')
      .toLowerCase();
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (hostname !== 'github.com' && hostname !== 'www.github.com') {
      return null;
    }

    return parsedUrl.pathname
      .replace(/^\/+/, '')
      .replace(/\/$/, '')
      .replace(/\.git$/i, '')
      .toLowerCase();
  } catch {
    return null;
  }
}

function listRemotes() {
  const { stdout } = git(['remote'], { capture: true });
  const remoteNames = stdout ? stdout.split('\n').filter(Boolean) : [];

  return remoteNames
    .map((name) => {
      const fetchUrl = git(['remote', 'get-url', name], { capture: true, allowFailure: true }).stdout;
      const pushUrl = git(['remote', 'get-url', '--push', name], { capture: true, allowFailure: true }).stdout;
      const repoSlug = normalizeGitHubRepo(pushUrl) ?? normalizeGitHubRepo(fetchUrl);

      return {
        name,
        fetchUrl,
        pushUrl,
        repoSlug,
        isOfficialRepo: repoSlug === OFFICIAL_REPO_SLUG,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function getRemoteByName(remoteName) {
  const remote = listRemotes().find(({ name }) => name === remoteName);

  if (!remote) {
    throw new Error(`Could not find git remote ${remoteName}.`);
  }

  return remote;
}

function ensureSafePushRemote(remote) {
  if (!remote.pushUrl) {
    throw new Error(`Remote ${remote.name} does not have a push URL configured.`);
  }

  if (remote.isOfficialRepo) {
    throw new Error(`Refusing to push to official repository remote ${remote.name} (${remote.pushUrl}).`);
  }
}

function describeRemote(remote) {
  return `${remote.name} (${remote.pushUrl || remote.fetchUrl})`;
}

function getOfficialTagSource(remotes) {
  return remotes.find(({ isOfficialRepo }) => isOfficialRepo)?.name ?? OFFICIAL_REPO_URL;
}

function getSuggestedForkRemoteName(remotes) {
  const existingRemoteNames = new Set(remotes.map(({ name }) => name));

  if (!existingRemoteNames.has(DEFAULT_FORK_REMOTE_NAME)) {
    return DEFAULT_FORK_REMOTE_NAME;
  }

  let index = 2;

  while (existingRemoteNames.has(`${DEFAULT_FORK_REMOTE_NAME}-${index}`)) {
    index += 1;
  }

  return `${DEFAULT_FORK_REMOTE_NAME}-${index}`;
}

function hasGitHubCli() {
  return gh(['--version'], { capture: true, allowFailure: true }).status === 0;
}

function hasGitHubAuth() {
  return gh(['auth', 'status'], { capture: true, allowFailure: true }).status === 0;
}

function canCreateForkWithGh() {
  return hasGitHubCli() && hasGitHubAuth();
}

async function ensureCleanWorkingTree(quickMode) {
  const { stdout } = git(['status', '--porcelain'], { capture: true });

  if (!stdout) {
    return;
  }

  if (quickMode) {
    throw new Error('Quick mode requires a clean working tree.');
  }

  const shouldContinue = await confirm({
    message: 'Your working tree is not clean. Continue anyway?',
    default: false,
  });

  if (!shouldContinue) {
    throw new Error('Aborting because the working tree is not clean.');
  }
}

function compareVersions(a, b) {
  const [aCoreStr, aPreStr] = a.split(/-(.+)/);
  const [bCoreStr, bPreStr] = b.split(/-(.+)/);
  const aParts = aCoreStr.split('.').map(Number);
  const bParts = bCoreStr.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const diff = (aParts[i] ?? 0) - (bParts[i] ?? 0);
    if (diff !== 0) return diff;
  }

  if (aPreStr && !bPreStr) return -1;
  if (!aPreStr && bPreStr) return 1;
  if (aPreStr && bPreStr) return aPreStr.localeCompare(bPreStr, undefined, { numeric: true });

  return 0;
}

function listVersionTags(source) {
  const { stdout } = git(['ls-remote', '--tags', '--refs', source], { capture: true });

  return stdout
    .split('\n')
    .map((line) => line.split('\t')[1])
    .filter(Boolean)
    .map((ref) => ref.replace(/^refs\/tags\//, ''))
    .filter((tag) => tag.startsWith(PACKAGE_PREFIX))
    .sort((left, right) =>
      compareVersions(right.slice(PACKAGE_PREFIX.length), left.slice(PACKAGE_PREFIX.length)),
    );
}

function listBranchNames(pushRemoteName) {
  const { stdout } = git(
    ['for-each-ref', '--format=%(refname:short)', 'refs/heads', `refs/remotes/${pushRemoteName}`],
    {
      capture: true,
    },
  );

  const names = new Set();
  const remotePrefix = `${pushRemoteName}/`;

  for (const rawBranch of stdout.split('\n')) {
    if (!rawBranch || rawBranch.endsWith('/HEAD')) {
      continue;
    }

    const branch = rawBranch.startsWith(remotePrefix) ? rawBranch.slice(remotePrefix.length) : rawBranch;

    if (branch) {
      names.add(branch);
    }
  }

  return [...names].sort((left, right) => left.localeCompare(right));
}

async function validateBranchName(branch) {
  if (!branch.trim()) {
    return 'Branch name is required.';
  }

  const result = git(['check-ref-format', '--branch', branch], { capture: true, allowFailure: true });

  if (result.status !== 0) {
    return 'Enter a valid git branch name.';
  }

  return true;
}

async function validateForkRemoteName(remoteName) {
  if (!remoteName.trim()) {
    return 'Remote name is required.';
  }

  if (/\s/.test(remoteName)) {
    return 'Remote name cannot contain whitespace.';
  }

  if (listRemotes().some(({ name }) => name === remoteName)) {
    return 'Choose a different remote name.';
  }

  return true;
}

async function validateForkRepoName(repoName) {
  if (!repoName.trim()) {
    return 'Fork repository name is required.';
  }

  if (repoName.includes('/')) {
    return 'Enter only the repository name, not owner/repository.';
  }

  return true;
}

async function promptForVersionTag(source, quickMode) {
  const tags = listVersionTags(source);

  if (tags.length === 0) {
    throw new Error(`No tags found matching ${PACKAGE_PREFIX}* in ${source}.`);
  }

  if (quickMode) {
    return tags[0];
  }

  return select({
    message: 'Select the package version tag to deploy',
    pageSize: 15,
    choices: tags.map((tag) => ({
      name: tag,
      value: tag,
    })),
  });
}

async function promptForTargetBranch(defaultBranch, pushRemoteName, quickMode) {
  if (quickMode) {
    return defaultBranch;
  }

  const branchMode = await select({
    message: 'Choose the output branch',
    choices: [
      {
        name: `Use suggested branch (${defaultBranch})`,
        value: 'default',
      },
      {
        name: 'Pick an existing branch',
        value: 'existing',
      },
      {
        name: 'Create a new branch',
        value: 'new',
      },
    ],
  });

  if (branchMode === 'default') {
    return defaultBranch;
  }

  if (branchMode === 'existing') {
    const branches = listBranchNames(pushRemoteName);

    if (branches.length === 0) {
      throw new Error(`No local or ${pushRemoteName} branches are available to choose from.`);
    }

    return select({
      message: 'Select the output branch',
      pageSize: 15,
      choices: branches.map((branch) => ({
        name: branch,
        value: branch,
      })),
    });
  }

  return input({
    message: 'Enter the new branch name',
    default: defaultBranch,
    validate: validateBranchName,
  });
}

function getSafePushRemotes(remotes) {
  return remotes
    .filter(({ pushUrl, isOfficialRepo }) => pushUrl && !isOfficialRepo)
    .sort((left, right) => {
      const priority = (remoteName) => {
        if (remoteName === 'origin') {
          return 0;
        }

        if (remoteName === DEFAULT_FORK_REMOTE_NAME) {
          return 1;
        }

        return 2;
      };

      return priority(left.name) - priority(right.name) || left.name.localeCompare(right.name);
    });
}

async function createForkRemote(remotes, quickMode) {
  const defaultForkRemoteName = getSuggestedForkRemoteName(remotes);
  const forkRepoName =
    quickMode ? DEFAULT_FORK_REPO_NAME : (
      (
        await input({
          message: 'Enter the GitHub fork repository name',
          default: DEFAULT_FORK_REPO_NAME,
          validate: validateForkRepoName,
        })
      ).trim()
    );

  const forkRemoteName =
    quickMode ? defaultForkRemoteName : (
      (
        await input({
          message: 'Enter the local git remote name for the fork',
          default: defaultForkRemoteName,
          validate: validateForkRemoteName,
        })
      ).trim()
    );

  logStep(`Creating fork ${forkRepoName} and configuring remote ${forkRemoteName}`);
  gh(['repo', 'fork', OFFICIAL_REPO_SLUG, '--remote', '--remote-name', forkRemoteName, '--fork-name', forkRepoName]);

  const forkRemote = getRemoteByName(forkRemoteName);

  ensureSafePushRemote(forkRemote);
  return forkRemote;
}

async function promptForPushRemote(remotes, quickMode) {
  const safePushRemotes = getSafePushRemotes(remotes);

  if (safePushRemotes.length > 0) {
    if (quickMode) {
      const pushRemote = safePushRemotes[0];

      ensureSafePushRemote(pushRemote);
      return pushRemote;
    }

    const remoteName = await select({
      message: 'Select the push remote',
      pageSize: 10,
      choices: safePushRemotes.map((remote) => ({
        name: describeRemote(remote),
        value: remote.name,
      })),
    });

    const pushRemote = safePushRemotes.find(({ name }) => name === remoteName);

    ensureSafePushRemote(pushRemote);
    return pushRemote;
  }

  if (!canCreateForkWithGh()) {
    throw new Error(
      `No safe push remote is configured. Add a fork remote for ${OFFICIAL_REPO_SLUG} and retry. The script refuses to push to the official repository.`,
    );
  }

  if (quickMode) {
    return createForkRemote(remotes, true);
  }

  const action = await select({
    message: 'No safe push remote is configured',
    choices: [
      {
        name: 'Create a fork and configure a push remote',
        value: 'create-fork',
      },
      {
        name: 'Abort',
        value: 'abort',
      },
    ],
  });

  if (action === 'abort') {
    throw new Error('Aborting because no safe push remote is configured.');
  }

  return createForkRemote(remotes, false);
}

function snapshotSubmodule(tempDir) {
  const submodulePath = path.join(repoDir, SUBMODULE_PATH);
  const snapshotPath = path.join(tempDir, 'submodule-content');
  const entries = readdirSync(submodulePath);

  if (entries.length === 0) {
    throw new Error(`Submodule ${SUBMODULE_PATH} is empty after update.`);
  }

  mkdirSync(snapshotPath, { recursive: true });

  for (const entry of entries) {
    if (entry === '.git') {
      continue;
    }

    cpSync(path.join(submodulePath, entry), path.join(snapshotPath, entry), {
      recursive: true,
      force: true,
      dereference: true,
    });
  }

  return snapshotPath;
}

function stripGitMetadata(targetPath) {
  if (!existsSync(targetPath)) {
    return;
  }

  for (const entry of readdirSync(targetPath, { withFileTypes: true })) {
    const entryPath = path.join(targetPath, entry.name);

    if (entry.name === '.git') {
      rmSync(entryPath, { recursive: true, force: true });
      continue;
    }

    if (entry.isDirectory()) {
      stripGitMetadata(entryPath);
    }
  }
}

function restoreSubmoduleContent(snapshotPath) {
  const submodulePath = path.join(repoDir, SUBMODULE_PATH);

  mkdirSync(submodulePath, { recursive: true });

  for (const entry of readdirSync(snapshotPath)) {
    cpSync(path.join(snapshotPath, entry), path.join(submodulePath, entry), {
      recursive: true,
      force: true,
      dereference: true,
    });
  }

  stripGitMetadata(submodulePath);
}

function readJsonFile(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function getSubmodulePackageJsonPath() {
  return path.join(repoDir, SUBMODULE_PATH, 'package.json');
}

function getSuggestedCopilotRuntimeVersion(appPackage) {
  const dependencies = appPackage.dependencies ?? {};

  return (
    dependencies['@copilotkit/runtime']
    ?? dependencies['@copilotkit/react-core']
    ?? dependencies['@copilotkit/react-ui']
    ?? dependencies['@copilotkit/react-textarea']
    ?? null
  );
}

async function maybeAddCopilotRuntime(quickMode) {
  const appPackageJsonPath = getSubmodulePackageJsonPath();

  if (!existsSync(appPackageJsonPath)) {
    return;
  }

  const appPackage = readJsonFile(appPackageJsonPath);
  const existingVersion = appPackage.dependencies?.['@copilotkit/runtime'];

  if (existingVersion) {
    console.log(`==> ${SUBMODULE_PATH} already depends on @copilotkit/runtime@${existingVersion}`);
    return;
  }

  const suggestedVersion = getSuggestedCopilotRuntimeVersion(appPackage);
  const defaultAddRuntime = Boolean(suggestedVersion);

  if (quickMode && !defaultAddRuntime) {
    return;
  }

  const shouldAddRuntime =
    quickMode ? true : (
      await confirm({
        message:
          suggestedVersion ?
            `Add @copilotkit/runtime@${suggestedVersion} to ${SUBMODULE_PATH}?`
          : `Add @copilotkit/runtime to ${SUBMODULE_PATH}?`,
        default: defaultAddRuntime,
      })
    );

  if (!shouldAddRuntime) {
    return;
  }

  const runtimeVersion =
    suggestedVersion
    ?? (
      await input({
        message: 'Enter the @copilotkit/runtime version to install',
        validate: (value) => (value.trim() ? true : 'Version is required.'),
      })
    ).trim();

  logStep(`Adding @copilotkit/runtime@${runtimeVersion} to ${SUBMODULE_PATH}`);
  run(
    'npm',
    ['install', '--package-lock-only', '--ignore-scripts', '--save-exact', `@copilotkit/runtime@${runtimeVersion}`],
    {
      cwd: path.join(repoDir, SUBMODULE_PATH),
    },
  );
}

function cleanupSubmoduleConfig() {
  const gitDir = git(['rev-parse', '--git-dir'], { capture: true }).stdout;
  const modulesPath = path.resolve(repoDir, gitDir, 'modules', SUBMODULE_PATH);

  rmSync(modulesPath, { recursive: true, force: true });
  git(['config', '--remove-section', `submodule.${SUBMODULE_PATH}`], { allowFailure: true });

  if (existsSync(path.join(repoDir, '.gitmodules'))) {
    git(['config', '-f', '.gitmodules', '--remove-section', `submodule.${SUBMODULE_PATH}`], { allowFailure: true });
  }
}

function prepareSubmoduleForInit() {
  const gitDir = git(['rev-parse', '--git-dir'], { capture: true }).stdout;
  const submodulePath = path.join(repoDir, SUBMODULE_PATH);
  const modulesPath = path.resolve(repoDir, gitDir, 'modules', SUBMODULE_PATH);

  git(['submodule', 'deinit', '-f', '--', SUBMODULE_PATH], { allowFailure: true });
  rmSync(submodulePath, { recursive: true, force: true });
  rmSync(modulesPath, { recursive: true, force: true });
}

function fetchVersionTag(source, versionTag) {
  git(['fetch', source, '--force', `refs/tags/${versionTag}:refs/tags/${versionTag}`]);
}

function pushBranch(pushRemoteName, branch, forcePush) {
  const pushRemote = getRemoteByName(pushRemoteName);

  ensureSafePushRemote(pushRemote);

  const args = ['push'];

  if (forcePush) {
    args.push('--force-with-lease');
  }

  args.push('--set-upstream', pushRemoteName, branch);
  git(args);
}

async function main() {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'orchestrator-ui-deploy-'));
  const cliOptions = parseCliArgs(process.argv.slice(2));
  let originalRef = null;

  try {
    ensureInteractiveTerminal(cliOptions.quick);
    await ensureCleanWorkingTree(cliOptions.quick);

    const remotes = listRemotes();
    const pushRemote = await promptForPushRemote(remotes, cliOptions.quick);
    const officialTagSource = getOfficialTagSource(remotes);
    const versionTag = await promptForVersionTag(officialTagSource, cliOptions.quick);
    const version = versionTag.slice(PACKAGE_PREFIX.length);
    const defaultBranch = `deploy-${version}`;

    logStep(`Fetching branches from ${pushRemote.name}`);
    git(['fetch', pushRemote.name, '--prune']);

    const branch = await promptForTargetBranch(defaultBranch, pushRemote.name, cliOptions.quick);
    const forcePush =
      cliOptions.quick ? false : (
        await confirm({
          message: `Force push to ${pushRemote.name}?`,
          default: false,
        })
      );

    console.log(`\nSelected tag: ${versionTag}`);
    console.log(`Push remote: ${pushRemote.name}`);
    console.log(`Target branch: ${branch}`);
    console.log(`Force push: ${forcePush ? 'yes' : 'no'}`);

    logStep(`Fetching package tag ${versionTag} from ${officialTagSource}`);
    fetchVersionTag(officialTagSource, versionTag);

    const symRef = git(['symbolic-ref', '--short', 'HEAD'], { capture: true, allowFailure: true });
    originalRef = symRef.status === 0 ? symRef.stdout : git(['rev-parse', 'HEAD'], { capture: true }).stdout;

    logStep(`Checking out package tag ${versionTag}`);
    git(['switch', '--detach', versionTag]);

    logStep(`Creating or resetting branch ${branch}`);
    git(['switch', '-C', branch]);

    logStep(`Preparing ${SUBMODULE_PATH} for submodule checkout`);
    prepareSubmoduleForInit();

    logStep('Initializing and updating submodules');
    git(['submodule', 'update', '--init']);

    const submodulePath = path.join(repoDir, SUBMODULE_PATH);

    if (!existsSync(submodulePath)) {
      throw new Error(`Submodule ${SUBMODULE_PATH} failed to initialize.`);
    }

    logStep(`Snapshotting ${SUBMODULE_PATH}`);
    const snapshotPath = snapshotSubmodule(tempDir);

    logStep(`Removing submodule ${SUBMODULE_PATH}`);
    git(['rm', '-f', SUBMODULE_PATH]);
    rmSync(submodulePath, { recursive: true, force: true });

    logStep('Restoring submodule content as regular files');
    restoreSubmoduleContent(snapshotPath);

    await maybeAddCopilotRuntime(cliOptions.quick);

    logStep('Cleaning up submodule config');
    cleanupSubmoduleConfig();

    logStep('Staging final state');
    git(['add', '-A']);

    logStep('Committing changes');
    // --no-verify: deploy commits are generated content, not subject to lint/test hooks
    git(['commit', '-m', COMMIT_MESSAGE(version), '--no-verify']);

    logStep(`Pushing branch ${branch} to ${pushRemote.name}`);
    pushBranch(pushRemote.name, branch, forcePush);

    console.log(`\n==> Done. Deployed version ${version} on branch ${branch}`);
  } catch (error) {
    if (originalRef) {
      console.error(`\nAttempting to restore HEAD to ${originalRef}...`);
      git(['switch', originalRef], { allowFailure: true });
    }
    throw error;
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  if (isPromptExit(error)) {
    console.error('\nDeployment cancelled.');
    process.exitCode = 1;
  } else {
    console.error(`\nError: ${error.message}`);
    process.exitCode = 1;
  }
});
