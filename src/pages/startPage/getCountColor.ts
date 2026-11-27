import type { WfoStatusColor } from '@/ui';

/**
 * For a count where more is worse, for example failed tasks: red above 0, green at 0.
 * Blue while the count is unknown, for example '-' while it loads.
 */
export const getCountColor = (count: number | string): WfoStatusColor => {
  const countAsNumber = Number(count);
  if (String(count).trim() === '' || !Number.isFinite(countAsNumber)) return 'info';
  return countAsNumber > 0 ? 'danger' : 'success';
};
