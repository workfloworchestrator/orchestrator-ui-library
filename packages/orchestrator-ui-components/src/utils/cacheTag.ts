import { CacheTag, CacheTagTypes } from '@/types';

export const getCacheTag = (type: CacheTagTypes, id?: string): CacheTag[] => {
    const cacheTag: CacheTag = {
        type,
    };
    if (id) {
        cacheTag.id = id;
    }
    return [cacheTag];
};
