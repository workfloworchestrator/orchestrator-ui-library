import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getStyles = ({ theme }: WfoThemeHelpers) => {
  const navigationHeight = theme.base * 3;
  const timelineStickyHeight = theme.base * 4;
  const stripBottomGap = theme.base;
  const stripMinHeight = theme.base * 40;

  // A page with its own sticky header sets --wfo-guide-sticky-top on a parent so the guide sticks below it
  const stickyTop = `var(--wfo-guide-sticky-top, ${timelineStickyHeight}px)`;

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
    top: stickyTop,
    minHeight: stripMinHeight,
    maxHeight: `calc(100vh - ${stickyTop} - ${navigationHeight + stripBottomGap}px)`,
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
    top: stickyTop,
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
    top: stickyTop,
    minHeight: stripMinHeight,
    maxHeight: `calc(100vh - ${stickyTop} - ${navigationHeight + stripBottomGap}px)`,
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

export const EDGE_TAB_WIDTH = 32;
const EDGE_TAB_MIN_HEIGHT = 120;
const GUIDE_GAP = 8;
const SLIDE_TRANSITION = '300ms cubic-bezier(0.2, 0, 0, 1)';

type EdgeTabStyleOptions = { size: 'tall' | 'compact'; attached: boolean; gap: string };

export const getEdgeTabStyles = ({ theme }: WfoThemeHelpers) => {
  const getEdgeTabStyle = ({ size, attached, gap }: EdgeTabStyleOptions) =>
    css({
      width: attached ? '100%' : `calc(100% - ${gap})`,
      marginInlineStart: attached ? 0 : gap,
      display: 'grid',
      alignSelf: 'center',
      placeItems: 'center',
      ...(size === 'tall' ?
        { height: `calc(100% - 2 * ${gap})`, minHeight: EDGE_TAB_MIN_HEIGHT, marginBlock: gap }
      : { padding: `${theme.size.l} 0` }),
      background: theme.colors.backgroundBasePrimary,
      border: `2px solid ${theme.colors.backgroundLightPrimary}`,
      // Attached: against the panel, no left border, round on the right only
      borderInlineStart: attached ? 0 : undefined,
      borderRadius:
        attached ? `0 ${theme.border.radius.medium} ${theme.border.radius.medium} 0` : theme.border.radius.medium,
      cursor: 'pointer',
      transition: 'border-color 100ms ease-in-out, background-color 100ms ease-in-out',
      '&:hover': {
        borderColor: theme.colors.borderBasePrimary,
        backgroundColor: theme.colors.backgroundLightPrimary,
      },
    });

  return { getEdgeTabStyle };
};

type TuckedGuideStyleOptions = { isOpen: boolean; openWidth?: string; stripWidth: number };

export const getTuckedGuideStyles = ({ theme }: WfoThemeHelpers) => {
  // The page scrolls in a box under the top navigation, so sticky offsets count from there (same top as the
  // start page's step list). One screen high: the viewport minus the navigation, the sticky top and a gap below.
  // Without the navigation height the guide is taller than the box: at the bottom of the page it is pushed up
  // and its top goes under the page header.
  const navigationHeight = theme.base * 3;
  const stickyTop = `var(--wfo-guide-sticky-top, ${theme.size.l})`;
  const screenHigh = `calc(100vh - ${navigationHeight}px - ${stickyTop} - ${theme.size.l})`;

  const containerStyle = css({
    // Same height as the cell: the guide inside is absolute, so a long guide text cannot make the row taller
    alignSelf: 'stretch',
    position: 'relative',
    // clips the guide sideways while it is "under" the panel; not downwards, so it can be taller than the cell
    overflowX: 'clip',
  });

  const getSliderStyle = ({ isOpen, openWidth, stripWidth }: TuckedGuideStyleOptions) =>
    css({
      display: 'flex',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: `calc(${openWidth ?? '100%'} - ${GUIDE_GAP}px)`,
      // Closed: shifted left by the guide width, so only the strip shows, attached to the panel.
      // Open: slides out GUIDE_GAP past the panel edge; a small gap, so the guide reads as its own object
      // that still belongs to the panel (law of proximity).
      transform: isOpen ? `translateX(${GUIDE_GAP}px)` : `translateX(calc(-100% + ${stripWidth}px))`,
      transition: `transform ${SLIDE_TRANSITION}`,
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    });

  const getGuideSectionStyle = (isOpen: boolean) =>
    css({
      flex: 1,
      minWidth: 0,
      display: 'flex',
      // One screen high, also next to a short panel; sticks while a long page scrolls
      alignSelf: 'flex-start',
      position: 'sticky',
      top: stickyTop,
      height: screenHigh,
      // Closed it is tucked behind the panel, but it can be taller than the panel: hide it once it has slid in
      visibility: isOpen ? 'visible' : 'hidden',
      transition: `visibility 0s linear ${isOpen ? 0 : 300}ms`,
    });

  const getTabBoxStyle = ({ isOpen, stripWidth }: Omit<TuckedGuideStyleOptions, 'openWidth'>) =>
    css({
      alignSelf: 'flex-start',
      position: 'sticky',
      top: stickyTop,
      display: 'grid',
      // Open: the tab always touches the guide, so it gives back the room of its gap (tabAttached={false})
      width: isOpen ? EDGE_TAB_WIDTH : stripWidth,
      transition: `width ${SLIDE_TRANSITION}`,
      flexShrink: 0,
      height: isOpen ? screenHigh : `min(100%, ${screenHigh})`,
    });

  return { containerStyle, getSliderStyle, getGuideSectionStyle, getTabBoxStyle };
};
