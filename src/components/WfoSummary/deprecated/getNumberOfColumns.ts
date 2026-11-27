import { warnDeprecated } from '@/utils/warnDeprecated';

/** @deprecated Use `WfoGrid` with `maxColumns`: it fits the columns to the width in CSS. Will be removed in the next major version. */
export const getNumberOfColumns = (currentBreakpoint: string | undefined) => {
  warnDeprecated('getNumberOfColumns', 'Use WfoGrid with maxColumns.');
  switch (currentBreakpoint) {
    case 'xxl':
      return 3;
    case 'xl':
      return 2;
    case 'l':
    case 'm':
    case 's':
    case 'xs':
    default:
      return 1;
  }
};
