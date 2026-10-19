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
  // Scales used while a minimal step is hovered or focused. Transforms don't affect layout, so nothing shifts
  const MINIMAL_ICON_HOVER_SCALE = 0.8;
  const MINIMAL_ROW_HOVER_SCALE = 1.03;

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
    paddingRight: theme.size.s,
    cursor: 'pointer',
    borderRadius: theme.border.radius.small,
    // Grow from the icon center so the icon stays on the spacer line
    transformOrigin: '36px center',
    transition: `background-color ${theme.animation.fast} ease-in, transform ${theme.animation.fast} ease-in`,
    '&:hover, &:focus-visible': {
      backgroundColor: theme.colors.backgroundBaseInteractiveHover,
      transform: `scale(${MINIMAL_ROW_HOVER_SCALE})`,
      '.wfoMinimalStepIcon > div': {
        transform: `scale(${MINIMAL_ICON_HOVER_SCALE})`,
      },
      '.wfoMinimalStepName': {
        display: 'block',
      },
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.colors.primary}`,
    },
    '@media (prefers-reduced-motion: reduce)': {
      '&, .wfoMinimalStepIcon > div': {
        transition: 'none',
      },
    },
  });

  const minimalStepNameStyle = css({
    color: theme.colors.textSubdued,
  });

  // Used with the "Hide minimal step name" option: the name only appears while the step is hovered or focused
  const minimalStepHiddenNameStyle = css({
    display: 'none',
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
    getStepHeaderStyle,
    getStepPanelStyle,
    getStepToggleExpandStyle,
  };
};
