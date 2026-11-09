import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  const navigationHeight = theme.base * 3;
  const timelineStickyHeight = theme.base * 4;
  const stripBottomGap = theme.base;
  const stripMinHeight = theme.base * 40;

  const fullHeightStyle = css({
    height: '100%',
  });

  const toggleStripContainerStyle = css({
    width: theme.base * 4,
    cursor: 'pointer',
  });

  const stickyStripContainerStyle = css({
    width: theme.base * 4,
    cursor: 'pointer',
    alignSelf: 'stretch',
    position: 'sticky',
    top: timelineStickyHeight,
    minHeight: stripMinHeight,
    maxHeight: `calc(100vh - ${navigationHeight + timelineStickyHeight + stripBottomGap}px)`,
  });

  const stripIconStyle = css({
    display: 'flex',
    justifyContent: 'center',
  });

  const stickyPanelFillStyle = css({
    flexGrow: 1,
  });

  const toggleStripContainerHorizontalStyle = css({
    width: '100%',
    height: theme.base * 4,
    cursor: 'pointer',
  });

  const stickyHorizontalStripContainerStyle = css({
    width: '100%',
    height: theme.base * 4,
    cursor: 'pointer',
    position: 'sticky',
    top: timelineStickyHeight,
    zIndex: 2,
  });

  const toggleStripPanelStyle = css({
    height: '100%',
    backgroundColor: theme.colors.backgroundBasePrimary,
    border: `2px solid ${theme.colors.backgroundLightPrimary}`,
    transition: 'border-color 100ms ease-in-out',
    '&:hover': {
      borderColor: theme.colors.borderBasePrimary,
    },
  });

  const guideExpandedItemStyle = css({
    alignSelf: 'stretch',
    position: 'sticky',
    top: timelineStickyHeight,
    minHeight: stripMinHeight,
    maxHeight: `calc(100vh - ${navigationHeight + timelineStickyHeight + stripBottomGap}px)`,
  });

  const guideExpandedFillStyle = css({
    position: 'absolute',
    inset: 0,
  });

  const guidePanelStyle = css({
    height: '100%',
    overflowY: 'auto',
    border: `2px solid ${theme.colors.backgroundLightPrimary}`,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  });

  const guideBodyStyle = css({
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  });

  const noLeftBorderStyle = css({
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  });

  const noBottomBorderStyle = css({
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  });

  const guideStackedBodyStyle = css({
    maxHeight: '50vh',
    overflowY: 'auto',
  });

  const guideStackedPanelStyle = css({
    border: `2px solid ${theme.colors.backgroundLightPrimary}`,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  });

  return {
    fullHeightStyle,
    toggleStripContainerStyle,
    stickyStripContainerStyle,
    stripIconStyle,
    stickyPanelFillStyle,
    toggleStripContainerHorizontalStyle,
    stickyHorizontalStripContainerStyle,
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
