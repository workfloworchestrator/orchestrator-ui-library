import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  const fullHeightStyle = css({
    height: '100%',
  });

  const toggleStripContainerStyle = css({
    width: theme.base * 3,
    cursor: 'pointer',
  });

  const toggleStripPanelStyle = css({
    height: '100%',
    backgroundColor: theme.colors.backgroundBasePrimary,
    border: `2px dashed ${theme.colors.backgroundLightPrimary}`,
    transition: 'box-shadow 100ms ease-in-out, border-style 100ms ease-in-out',
    '&:hover': {
      borderStyle: 'solid',
      boxShadow: `0 0 0 2px ${theme.colors.backgroundBasePrimary}`,
    },
  });

  const guidePanelStyle = css({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: `2px dashed ${theme.colors.backgroundLightPrimary}`,
    borderRightWidth: 0,
  });

  const guideBodyStyle = css({
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  });

  const noLeftBorderStyle = css({
    borderLeftWidth: 0,
  });

  return {
    fullHeightStyle,
    toggleStripContainerStyle,
    toggleStripPanelStyle,
    noLeftBorderStyle,
    guidePanelStyle,
    guideBodyStyle,
  };
};
