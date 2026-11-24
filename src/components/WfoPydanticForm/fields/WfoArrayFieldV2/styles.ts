import { css } from '@emotion/react';

import { WfoComputedTheme } from '@/theme';

export const getWfoArrayFieldV2Styles = (theme: WfoComputedTheme) => {
  const container = css({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.size.m,
  });

  const row = css({
    display: 'flex',
    gap: theme.size.s,
    alignItems: 'center',
    '& > :first-child': {
      flexGrow: 1,
    },
  });

  const card = css({
    border: `${theme.border.width.thin} solid ${theme.colors.borderBaseSubdued}`,
    borderRadius: theme.border.radius.panel,
    backgroundColor: theme.colors.backgroundBasePlain,
    padding: theme.size.base,
    margin: 0,
    minWidth: 0,
    // Backend layout puts fields side by side; below 640px (e.g. 50/50 = 2x ~250px) values get cut off, so stack
    containerType: 'inline-size',
    '@container (max-width: 640px)': {
      '[class^="pf-col-span-"]': { gridColumn: '1 / -1 !important' },
    },
  });

  // Group of a list of lists: grey box around white item cards, so the two levels differ at a glance
  const group = css({
    border: `${theme.border.width.thin} solid ${theme.colors.borderBasePlain}`,
    borderRadius: theme.border.radius.panel,
    backgroundColor: theme.colors.backgroundBaseSubdued,
    padding: theme.size.base,
    margin: 0,
    minWidth: 0,
  });

  const cardHeader = css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.size.m,
    legend: {
      padding: 0,
    },
  });

  // One field per line: easiest to scan and fill in, no cut-off inputs
  const cardFields = css({
    display: 'flex',
    flexDirection: 'column',
  });

  return { container, row, card, group, cardHeader, cardFields };
};
