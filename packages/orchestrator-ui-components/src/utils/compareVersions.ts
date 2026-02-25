import { MappedVersion } from '@/types';

const compareVersions = (versionString1: string, versionString2: string): number => {
  const splittedVersion1 = versionString1.split('.');
  const splittedVersion2 = versionString2.split('.');

  for (let i = 0; i < splittedVersion1.length; i++) {
    if (parseInt(splittedVersion1[i]) > parseInt(splittedVersion2[i])) {
      return 1;
    } else if (parseInt(splittedVersion1[i]) < parseInt(splittedVersion2[i])) {
      return -1;
    }
  }
  return 0;
};

const findMinimumOrchestratorCoreVersion = (
  orchestratorUiVersion: string,
  versionMappings: MappedVersion[],
): string => {
  const orchestratorUiVersions = versionMappings.map((version) => version.orchestratorUiVersion);
  let mappedVersion = versionMappings[0];

  for (let i = 0; i < orchestratorUiVersions.length; i++) {
    if ([0, 1].includes(compareVersions(orchestratorUiVersion, orchestratorUiVersions[i]))) {
      mappedVersion = versionMappings[i];
    }
  }

  return mappedVersion.minimumOrchestratorCoreVersion;
};

export const getOrchestratorCoreVersionIfNotCompatible = (
  orchestratorUiVersion: string,
  orchestratorCoreVersion: string,
  versionMappings: MappedVersion[],
): string | null => {
  const minimumOrchestratorCoreVersion = findMinimumOrchestratorCoreVersion(orchestratorUiVersion, versionMappings);
  const comparison = compareVersions(orchestratorCoreVersion, minimumOrchestratorCoreVersion);
  if (comparison === -1) {
    return minimumOrchestratorCoreVersion;
  }
  return null;
};
