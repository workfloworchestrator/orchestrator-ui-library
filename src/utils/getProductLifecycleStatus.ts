import { ProductLifecycleStatus } from '@/types';

const productStatusAsString = Object.values(ProductLifecycleStatus) as string[];

export const getProductLifecycleStatus = (rawStatus: string): ProductLifecycleStatus => {
  const trimmed = rawStatus.trim();
  if (productStatusAsString.includes(trimmed)) {
    return trimmed as ProductLifecycleStatus;
  }

  const normalizedKey = trimmed.replace(/\s+/g, '_').toUpperCase();
  return ProductLifecycleStatus[normalizedKey as keyof typeof ProductLifecycleStatus];
};
