import { MappedVersion } from '@/types';

const compareVersions = (v1: string, v2: string): number => {
  const parse = (v: string) => {
    const parts = v.split('.');

    const major = parseInt(parts[0]);
    const minor = parseInt(parts[1]);

    const patchPart = parts[2] ?? '';

    let patch = 0;
    let suffix = '';

    // extract numeric patch and suffix manually
    for (let i = 0; i < patchPart.length; i++) {
      const char = patchPart[i];

      if (char >= '0' && char <= '9') {
        patch = patch * 10 + Number(char);
      } else {
        suffix = patchPart.slice(i);
        break;
      }
    }

    return { major, minor, patch, suffix };
  };

  const a = parse(v1);
  const b = parse(v2);

  // compare numeric parts
  if (a.major !== b.major) return a.major > b.major ? 1 : -1;
  if (a.minor !== b.minor) return a.minor > b.minor ? 1 : -1;
  if (a.patch !== b.patch) return a.patch > b.patch ? 1 : -1;

  // compare suffix
  if (a.suffix === b.suffix) return 0;
  if (!a.suffix) return 1; // stable > pre-release
  if (!b.suffix) return -1;

  return a.suffix > b.suffix ? 1 : -1;
};

const findMinimumOrchestratorCoreVersion = (
  orchestratorUiVersion: string,
  versionMappings: MappedVersion[],
): string | null => {
  // sort mappings descending by UI version. This is done just in case the input versionMappings are not sorted
  const sorted = [...versionMappings].sort((a, b) => compareVersions(b.orchestratorUiVersion, a.orchestratorUiVersion));

  for (const mapping of sorted) {
    if (compareVersions(orchestratorUiVersion, mapping.orchestratorUiVersion) >= 0) {
      return mapping.minimumOrchestratorCoreVersion;
    }
  }

  return sorted[sorted.length - 1]?.minimumOrchestratorCoreVersion ?? null;
};

export const getOrchestratorCoreVersionIfNotCompatible = (
  orchestratorUiVersion: string,
  orchestratorCoreVersion: string,
  versionMappings: MappedVersion[],
): string | null => {
  const minimumVersion = findMinimumOrchestratorCoreVersion(orchestratorUiVersion, versionMappings);

  if (!minimumVersion) {
    return null;
  }

  const isCompatible = compareVersions(orchestratorCoreVersion, minimumVersion) !== -1;

  return isCompatible ? null : minimumVersion;
};
