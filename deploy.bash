#!/usr/bin/env bash

set -euo pipefail

# Configuration
SUBMODULE_PATH="apps/wfo-ui"
PACKAGE_PREFIX="@orchestrator-ui/orchestrator-ui-components@"

echo "==> Fetching latest tags"
git fetch --tags

# Get the latest version tag from git
VERSION_TAG=$(git tag --list "${PACKAGE_PREFIX}*" | sort -V | tail -n 1)

if [[ -z "${VERSION_TAG}" ]]; then
  echo "Error: No tags found matching ${PACKAGE_PREFIX}*" >&2
  exit 1
fi

VERSION="${VERSION_TAG#${PACKAGE_PREFIX}}"
BRANCH="deploy-${VERSION}"

echo "==> Using version ${VERSION} (from tag ${VERSION_TAG})"

# Check if we are on a clean state (optional but recommended)
if ! git diff-index --quiet HEAD --; then
    echo "Warning: Your working directory is not clean. Changes may be lost."
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborting."
        exit 1
    fi
fi

echo "==> Checking out package tag ${VERSION_TAG}"
git checkout "${VERSION_TAG}"

# Delete branch if it already exists to allow re-running the script
if git show-ref --verify --quiet "refs/heads/${BRANCH}"; then
  echo "==> Deleting existing branch ${BRANCH}"
  git branch -D "${BRANCH}"
fi

echo "==> Creating branch ${BRANCH}"
git checkout -b "${BRANCH}"

echo "==> Ensuring ${SUBMODULE_PATH} is clean"

if [ -d "${SUBMODULE_PATH}" ]; then
  # If it's a submodule, we need to handle it carefully
  if [ -f "${SUBMODULE_PATH}/.git" ] || [ -d "${SUBMODULE_PATH}/.git" ]; then
    echo "==> Removing existing submodule at ${SUBMODULE_PATH}"
    git rm -f "${SUBMODULE_PATH}" || rm -rf "${SUBMODULE_PATH}"
  else
    rm -rf "${SUBMODULE_PATH}"
  fi
fi

mkdir -p "${SUBMODULE_PATH}"

echo "==> Initializing and updating submodules"
git submodule init
git submodule update
git submodule update --remote

# Verify submodule was actually updated and exists
if [ ! -d "${SUBMODULE_PATH}" ] || [ -z "$(ls -A "${SUBMODULE_PATH}")" ]; then
  echo "Error: Submodule ${SUBMODULE_PATH} failed to initialize or is empty" >&2
  exit 1
fi

echo "==> Removing submodule git metadata"
find "${SUBMODULE_PATH}" -name ".git" -exec rm -rf {} + 2>/dev/null || true

echo "==> Removing submodule from index"
git rm --cached "${SUBMODULE_PATH}" 2>/dev/null || true

echo "==> Re-adding submodule content as regular files"
git add "${SUBMODULE_PATH}/"

echo "==> Cleaning up submodule config"
rm -rf ".git/modules/${SUBMODULE_PATH}" 2>/dev/null || true
git config --remove-section "submodule.${SUBMODULE_PATH}" 2>/dev/null || true
# Also clean .gitmodules file if it exists
if [ -f .gitmodules ]; then
    git config -f .gitmodules --remove-section "submodule.${SUBMODULE_PATH}" 2>/dev/null || true
    git add .gitmodules
fi

echo "==> Staging final state"
git add -A

echo "==> Committing changes"
git commit -m "Deploy version ${VERSION}: remove submodule ${SUBMODULE_PATH} and add its content directly" --no-verify

echo "==> Pushing branch ${BRANCH}"
git push --set-upstream origin "${BRANCH}"

echo "==> Done. Deployed version ${VERSION} on branch ${BRANCH}"
