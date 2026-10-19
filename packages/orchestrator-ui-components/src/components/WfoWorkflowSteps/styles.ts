import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWorkflowStepsStyles = ({ theme, toSecondaryColor, isDarkModeActive }: WfoThemeHelpers) => {
  const SPACE_BETWEEN_STEPS = theme.base * 1.5;
  const STEP_ICON_SIZE = 40;

  const stepSpacerStyle = css({
    borderLeft: `1px solid ${theme.colors.backgroundBaseAccent}`,
    height: `${SPACE_BETWEEN_STEPS}px`,
    marginLeft: '36px',
  });

  const stepRowStyle = css({
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  });

  const stepListHeaderStyle = css({
    marginBottom: '24px',
    marginTop: '60px',
    alignItems: 'flex-end',
  });

  const stepListContentStyle = css({
    flexDirection: 'row',
    alignItems: 'center',
  });

  const stepListContentBoldTextStyle = css({
    fontSize: theme.size.base,
    fontWeight: theme.font.weight.bold,
  });

  const stepListContentAnchorStyle = css({
    marginTop: 2,
    marginLeft: 0,
    fontSize: theme.size.m,
    fontWeight: theme.font.weight.bold,
    color: theme.colors.link,
    cursor: 'pointer',
  });

  const stepListOptionsContainerStyle = css({
    flexGrow: 0,
  });

  const stepStateIcon = {
    height: `${STEP_ICON_SIZE}px`,
    width: `${STEP_ICON_SIZE}px`,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '24px',
  };

  const stepDurationStyle = {
    fontSize: theme.size.m,
    color: theme.colors.textSubdued,
    fontWeight: theme.font.weight.semiBold,
  };

  const stepStateSuccessIconStyle = css({
    ...stepStateIcon,
    backgroundColor: isDarkModeActive ? toSecondaryColor(theme.colors.link) : theme.colors.backgroundLightPrimary,
  });

  const stepStateSuspendIconStyle = css({
    ...stepStateIcon,
    backgroundColor: toSecondaryColor(theme.colors.warning),
  });

  const stepStatePendingIconStyle = css({
    ...stepStateIcon,
    backgroundColor: toSecondaryColor(theme.colors.backgroundBaseAccent),
  });
  const stepStateFailedIconStyle = css({
    ...stepStateIcon,
    backgroundColor: toSecondaryColor(theme.colors.danger),
  });

  // Minimal steps show the status icon scaled down
  const MINIMAL_ICON_SCALE = 0.6;
  const MINIMAL_ICON_SIZE = STEP_ICON_SIZE * MINIMAL_ICON_SCALE;
  // Icon scale while a minimal step is hovered or focused. Transforms don't affect layout, so nothing shifts
  const MINIMAL_ICON_HOVER_SCALE = 0.8;
  // How far the hover background grows above, below and to the left of the row. It never grows to the right,
  // so its right edge stays aligned with the step cards
  const MINIMAL_ROW_HOVER_GROWTH = theme.size.xs;

  const stepStateMinimalIconWrapperStyle = css({
    width: `${MINIMAL_ICON_SIZE}px`,
    height: `${MINIMAL_ICON_SIZE}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > div': {
      flexShrink: 0,
      transform: `scale(${MINIMAL_ICON_SCALE})`,
      transition: `transform ${theme.animation.fast} ease-in`,
    },
  });

  const minimalStepRowStyle = css({
    display: 'flex',
    alignItems: 'center',
    gap: theme.size.s,
    // Aligns the scaled icon with the center of the regular step icons and the spacer line
    paddingLeft: `${36 - MINIMAL_ICON_SIZE / 2}px`,
    // Matches the padding and border of the step cards (EuiPanel), so right-aligned content lines up
    paddingRight: `calc(${theme.size.base} + ${theme.border.width.thin})`,
    position: 'relative',
    // Keeps the hover layer (z-index -1) behind the row's content but in front of the page background
    isolation: 'isolate',
    cursor: 'pointer',
    borderRadius: theme.border.radius.small,
    // The hover background is a separate layer, so it can grow without moving the row's content
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      zIndex: -1,
      borderRadius: 'inherit',
      backgroundColor: 'transparent',
      transition: `background-color ${theme.animation.fast} ease-in, inset ${theme.animation.fast} ease-in`,
    },
    '&:hover, &:focus-visible': {
      '&::before': {
        backgroundColor: theme.colors.backgroundBaseInteractiveHover,
        inset: `calc(-1 * ${MINIMAL_ROW_HOVER_GROWTH}) 0 calc(-1 * ${MINIMAL_ROW_HOVER_GROWTH}) calc(-1 * ${MINIMAL_ROW_HOVER_GROWTH})`,
      },
      '.wfoMinimalStepIcon > div': {
        transform: `scale(${MINIMAL_ICON_HOVER_SCALE})`,
      },
      '.wfoMinimalStepName': {
        display: 'flex',
        fontWeight: theme.font.weight.bold,
      },
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.colors.primary}`,
    },
    '@media (prefers-reduced-motion: reduce)': {
      '&::before, .wfoMinimalStepIcon > div': {
        transition: 'none',
      },
    },
  });

  const minimalStepNameStyle = css({
    display: 'flex',
    flexDirection: 'column',
    color: theme.colors.textSubdued,
    // Reserves the width of the bold name, so the name doesn't shift when it turns bold on hover
    '&::after': {
      content: 'attr(data-text)',
      fontWeight: theme.font.weight.bold,
      height: 0,
      visibility: 'hidden',
      overflow: 'hidden',
      userSelect: 'none',
      pointerEvents: 'none',
    },
  });

  // Used with the "Hide minimal step name" option: the name only appears while the step is hovered or focused
  const minimalStepHiddenNameStyle = css({
    display: 'none',
  });

  const minimalStepDurationStyle = css({
    color: theme.colors.textSubdued,
    fontVariantNumeric: 'tabular-nums',
  });

  // The "Duration" label is kept invisible and without height, so the duration column gets the same width
  // as on the step cards and its value is centered at the same position
  const minimalStepDurationLabelStyle = css({
    visibility: 'hidden',
    height: 0,
    overflow: 'hidden',
  });

  const stepHeaderRightStyle = css({
    alignItems: 'center',
  });

  const stepEmailContainerStyle = css({
    paddingLeft: 24,
    width: 600,
    marginTop: 0,
  });

  const getStepHeaderStyle = (isClickable: boolean) =>
    css({
      gap: 0,
      alignItems: 'center',
      cursor: isClickable ? 'pointer' : 'default',
    });

  // Subtle highlight of clickable step cards, so it's clear which step is toggled on click
  const getStepPanelStyle = (isClickable: boolean) =>
    css({
      transition: `border-color ${theme.animation.fast} ease-in, box-shadow ${theme.animation.fast} ease-in`,
      ...(isClickable && {
        '&:has(.wfoStepHeader:hover)': {
          borderColor: theme.colors.borderBasePrimary,
          boxShadow: `0 0 0 1px ${theme.colors.borderBasePrimary}`,
        },
      }),
    });

  const getStepToggleExpandStyle = (isVisible: boolean) =>
    css({
      marginRight: theme.base / 2,
      visibility: isVisible ? 'visible' : 'hidden',
    });

  return {
    SPACE_BETWEEN_STEPS,
    stepDurationStyle,
    stepEmailContainerStyle,
    stepHeaderRightStyle,
    stepListContentAnchorStyle,
    stepListContentBoldTextStyle,
    stepListContentStyle,
    stepListHeaderStyle,
    stepListOptionsContainerStyle,
    stepRowStyle,
    stepSpacerStyle,
    stepStateFailedIconStyle,
    stepStatePendingIconStyle,
    stepStateSuccessIconStyle,
    stepStateSuspendIconStyle,
    stepStateMinimalIconWrapperStyle,
    minimalStepRowStyle,
    minimalStepNameStyle,
    minimalStepHiddenNameStyle,
    minimalStepDurationStyle,
    minimalStepDurationLabelStyle,
    getStepHeaderStyle,
    getStepPanelStyle,
    getStepToggleExpandStyle,
  };
};
