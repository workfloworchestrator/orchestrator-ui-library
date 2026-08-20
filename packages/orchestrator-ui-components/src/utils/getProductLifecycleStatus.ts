import { ProductLifecycleStatus } from '@/types';

export const getProductLifecycleStatus = (rawStatus: string): ProductLifecycleStatus =>
  ProductLifecycleStatus[rawStatus.toUpperCase() as keyof typeof ProductLifecycleStatus];
