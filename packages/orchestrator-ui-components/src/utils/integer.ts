export const toPercentage = (fraction: number): string => {
  return `${(fraction * 100).toFixed(1)}%`;
};
