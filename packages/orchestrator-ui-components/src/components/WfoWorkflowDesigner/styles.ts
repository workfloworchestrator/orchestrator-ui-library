import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWorkflowDesignerStyles = ({ theme }: WfoThemeHelpers) => {
  const columnsStyle = css({
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 1fr) minmax(360px, 1.4fr) minmax(280px, 1fr)',
    gap: theme.size.l,
    alignItems: 'start',
    '@media (max-width: 1100px)': {
      gridTemplateColumns: '1fr',
    },
  });

  const columnStyle = css({
    minWidth: 0,
  });

  // The palette and canvas scroll on their own, so a long step list does not push the inspector out of view.
  const scrollAreaStyle = css({
    maxHeight: '70vh',
    overflowY: 'auto',
  });

  const paletteItemStyle = css({
    padding: `${theme.size.s} ${theme.size.m}`,
    cursor: 'grab',
  });

  const disabledPaletteItemStyle = css({
    opacity: 0.55,
    cursor: 'not-allowed',
  });

  const stepCardStyle = css({
    padding: theme.size.m,
    cursor: 'grab',
  });

  const selectedStepCardStyle = css({
    outline: `2px solid ${theme.colors.primary}`,
  });

  const fixedCardStyle = css({
    padding: theme.size.m,
    backgroundColor: theme.colors.backgroundBaseSubdued,
  });

  const stateChipsStyle = css({
    padding: `${theme.size.xs} ${theme.size.m}`,
    borderLeft: `2px dashed ${theme.colors.borderBaseSubdued}`,
    marginLeft: theme.size.l,
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.size.xs,
  });

  const emptyCanvasStyle = css({
    padding: theme.size.xl,
    textAlign: 'center',
    border: `2px dashed ${theme.colors.borderBasePlain}`,
    borderRadius: theme.border.radius.medium,
    color: theme.colors.textSubdued,
  });

  const monospaceStyle = css({
    fontFamily: theme.font.familyCode,
    fontSize: theme.size.m,
    wordBreak: 'break-all',
  });

  return {
    columnsStyle,
    columnStyle,
    scrollAreaStyle,
    paletteItemStyle,
    disabledPaletteItemStyle,
    stepCardStyle,
    selectedStepCardStyle,
    fixedCardStyle,
    stateChipsStyle,
    emptyCanvasStyle,
    monospaceStyle,
  };
};
