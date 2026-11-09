export const toPercentage = (fraction: number, digits = 1): string => {
  return `${(fraction * 100).toFixed(digits)}%`;
};
