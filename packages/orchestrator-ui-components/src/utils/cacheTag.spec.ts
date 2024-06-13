import { CacheTagTypes } from '@/types';

import { getCacheTag } from './cacheTag';

describe('getCacheTag', () => {
    it('returns cacheTag with type only when no id is passed', () => {
        const result = getCacheTag(CacheTagTypes.processes);
        expect(result).toBe([{ type: CacheTagTypes.processes }]);
    });
    it('returns cacheTag with type and id if id is passed', () => {
        const result = getCacheTag(CacheTagTypes.processes, '123');
        expect(result).toBe([{ type: CacheTagTypes.processes, id: '123' }]);
    });
});
