import { MappedVersion } from '@/types';

import { getOrchestratorCoreVersionIfNotCompatible } from './compareVersions';

const TEST_VERSIONS: MappedVersion[] = [
  {
    orchestratorUiVersion: '3.4.0',
    minimumOrchestratorCoreVersion: '2.10.0',
    changes: 'Endpoints in BE to modify description on metadata pages',
  },
  {
    orchestratorUiVersion: '3.8.1',
    minimumOrchestratorCoreVersion: '3.0.0',
    changes: 'Endpoints in BE to modify description on metadata pages',
  },
  {
    orchestratorUiVersion: '3.10.0',
    minimumOrchestratorCoreVersion: '3.1.1',
    changes: 'Endpoints in BE to modify description on metadata pages',
  },
];

describe('isOrchestratorUiVersionCompatible', () => {
  test('returns true if orchestratorCoreVersion matches exactly the minimum required orchestratorCoreVersion', () => {
    expect(getOrchestratorCoreVersionIfNotCompatible('3.4.0', '2.10.0', TEST_VERSIONS)).toBe(null);
    expect(getOrchestratorCoreVersionIfNotCompatible('3.8.1', '3.0.0', TEST_VERSIONS)).toBe(null);
    expect(getOrchestratorCoreVersionIfNotCompatible('3.10.0', '3.1.1', TEST_VERSIONS)).toBe(null);
  });

  test('returns true if orchestratorCoreVersion is newer than the minimum required orchestratorCoreVersion', () => {
    expect(getOrchestratorCoreVersionIfNotCompatible('3.4.0', '2.11.0', TEST_VERSIONS)).toBe(null);
    expect(getOrchestratorCoreVersionIfNotCompatible('3.8.1', '3.0.1', TEST_VERSIONS)).toBe(null);
    expect(getOrchestratorCoreVersionIfNotCompatible('3.10.0', '4.2.0', TEST_VERSIONS)).toBe(null);
  });

  test('returns false if orchestratorCoreVersion is older than minimum required orchestratorCoreVersion', () => {
    expect(getOrchestratorCoreVersionIfNotCompatible('3.4.0', '2.9.9', TEST_VERSIONS)).toBe('2.10.0');
    expect(getOrchestratorCoreVersionIfNotCompatible('3.8.1', '2.10.9', TEST_VERSIONS)).toBe('3.0.0');
    expect(getOrchestratorCoreVersionIfNotCompatible('3.10.0', '3.0.5', TEST_VERSIONS)).toBe('3.1.1');
  });

  test('handles orchestratorUiVersions not exactly in MAPPED_VERSIONS by selecting previous compatible minimum version', () => {
    expect(getOrchestratorCoreVersionIfNotCompatible('3.9.0', '3.0.0', TEST_VERSIONS)).toBe(null); // nearest lower mapped version is 3.8.1
    expect(getOrchestratorCoreVersionIfNotCompatible('3.11.0', '3.1.1', TEST_VERSIONS)).toBe(null); // nearest lower mapped is 3.10.0
  });

  test('handles orchestratorUiVersions lower than lowest mapped version', () => {
    expect(getOrchestratorCoreVersionIfNotCompatible('1.0.0', '2.10.0', TEST_VERSIONS)).toBe(null); // falls back to first MAPPED_VERSION
    expect(getOrchestratorCoreVersionIfNotCompatible('1.0.0', '2.9.9', TEST_VERSIONS)).toBe('2.10.0');
  });
});
