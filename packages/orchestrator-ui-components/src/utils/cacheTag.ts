import { CacheTag, CacheTagType } from '@/types';

export const getCacheTag = (type: CacheTagType, id?: string): CacheTag[] => {
  const cacheTag: CacheTag = {
    type,
  };
  if (id) {
    cacheTag.id = id;
  }
  return [cacheTag];
};
