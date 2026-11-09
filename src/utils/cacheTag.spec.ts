import { CacheTagType } from '@/types';

import { getCacheTag } from './cacheTag';

describe('getCacheTag', () => {
  it('returns cacheTag with type only when no id is passed', () => {
    const result = getCacheTag(CacheTagType.processes);
    expect(result).toEqual([{ type: CacheTagType.processes }]);
  });
  it('returns cacheTag with type and id if id is passed', () => {
    const result = getCacheTag(CacheTagType.processes, '123');
    expect(result).toEqual([{ type: CacheTagType.processes, id: '123' }]);
  });
});
