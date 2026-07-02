import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  const fullHeightStyle = css({
    height: '100%',
  });

  const toggleStripContainerStyle = css({
    width: theme.base * 4,
    cursor: 'pointer',
  });

  const toggleStripContainerHorizontalStyle = css({
    width: '100%',
    height: theme.base * 4,
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

  const guideExpandedItemStyle = css({
    position: 'relative',
  });

  const guideExpandedFillStyle = css({
    position: 'absolute',
    inset: 0,
  });

  const guidePanelStyle = css({
    height: '100%',
    overflowY: 'auto',
    border: `2px dashed ${theme.colors.backgroundLightPrimary}`,
    borderRightWidth: 0,
  });

  const guideBodyStyle = css({
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  });

  const noLeftBorderStyle = css({
    borderLeftWidth: 0,
  });

  const noBottomBorderStyle = css({
    borderBottomWidth: 0,
  });

  const guideStackedBodyStyle = css({
    maxHeight: '50vh',
    overflowY: 'auto',
  });

  const guideStackedPanelStyle = css({
    border: `2px dashed ${theme.colors.backgroundLightPrimary}`,
    borderTopWidth: 0,
  });

  return {
    fullHeightStyle,
    toggleStripContainerStyle,
    toggleStripContainerHorizontalStyle,
    toggleStripPanelStyle,
    noLeftBorderStyle,
    noBottomBorderStyle,
    guidePanelStyle,
    guideBodyStyle,
    guideStackedBodyStyle,
    guideStackedPanelStyle,
    guideExpandedItemStyle,
    guideExpandedFillStyle,
  };
};
