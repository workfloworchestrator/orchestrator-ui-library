import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const FORM_INPUT_MAX_WIDTH = 400;

// New start-workflow layout (WfoStartProcessPageBeta)
export const getStartProcessPageBetaStyles = ({ theme }: WfoThemeHelpers) => {
  // Same margins as the info line, so the page does not move down when the subscription comes in
  const subscriptionLoadingStyle = css({
    marginTop: theme.size.xs,
    marginBottom: theme.size.s,
  });

  const fullWidthLimitStyle = css({
    maxWidth: '100%',
  });

  const subscriptionItemStyle = css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  });

  const shrinkableStyle = css({
    minWidth: 0,
  });

  // A long subscription description gets an ellipsis (full text on hover)
  const subscriptionLinkStyle = css({
    display: 'block',
    maxWidth: 'min(480px, 50vw)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });

  // Skeleton of a step while the next page loads: about the size of a real step
  const stepNumberSkeletonStyle = css({
    width: theme.base * 4,
  });

  const stepTitleSkeletonStyle = css({
    width: theme.base * 15,
  });

  const fieldRowSkeletonStyle = css({
    marginBottom: theme.size.l,
  });

  // 65ch: readable line length for UI descriptions (45–65 characters)
  const fieldDescriptionSkeletonStyle = css({
    maxWidth: '65ch',
  });

  const fieldInputSkeletonStyle = css({
    maxWidth: FORM_INPUT_MAX_WIDTH,
  });

  return {
    subscriptionLoadingStyle,
    fullWidthLimitStyle,
    subscriptionItemStyle,
    shrinkableStyle,
    subscriptionLinkStyle,
    stepNumberSkeletonStyle,
    stepTitleSkeletonStyle,
    fieldRowSkeletonStyle,
    fieldDescriptionSkeletonStyle,
    fieldInputSkeletonStyle,
  };
};

// New process detail layout (WfoProcessDetail)
export const getProcessDetailBetaStyles = ({ theme }: WfoThemeHelpers) => {
  const stickyHeaderStyle = css({
    position: 'sticky',
    top: 0,
    zIndex: 3,
    background: theme.colors.backgroundBasePlain,
    // The step cards scroll under the header; their shadows (14px to the sides, 20px down) must stay under it
    // too. So the header is wider than the content (to the page section's edges) and has its own space
    // at the bottom. A card shadow bigger than this space would show next to or below the header again.
    marginInline: `-${theme.size.l}`,
    padding: `${theme.size.s} ${theme.size.l} ${theme.size.l}`,
  });

  // Flex anchor: an inline anchor adds line-height under the button, which puts it off the centre line
  const tooltipAnchorStyle = css({
    display: 'flex',
  });

  /**
   * Grid with the steps and the user guide, below the sticky header.
   * @param headerHeight measured height of the sticky header
   * @param guideColumnWidth width of the guide column (big screen); undefined: one column, the guide stacks on top
   */
  const getContentGridStyle = (headerHeight: number, guideColumnWidth?: string) =>
    css({
      // The user guide sticks right below the sticky header
      '--wfo-guide-sticky-top': `${headerHeight}px`,
      // A timeline click scrolls the step to just below the header (navigation + header + a step gap)
      '--wfo-step-scroll-offset': `${theme.base * 3 + headerHeight + theme.base * 1.5}px`,
      // Own stacking layer: a z-index inside a step (the code viewer's sticky lines) cannot paint over the header
      isolation: 'isolate',
      display: 'grid',
      alignItems: 'start',
      // The column width is animated (not swapped), so opening the guide slides the content instead of jumping
      gridTemplateColumns: guideColumnWidth ? `minmax(0, 1fr) ${guideColumnWidth}` : 'minmax(0, 1fr)',
      transition: 'grid-template-columns 300ms cubic-bezier(0.2, 0, 0, 1)',
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    });

  return {
    stickyHeaderStyle,
    tooltipAnchorStyle,
    getContentGridStyle,
  };
};
