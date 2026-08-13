import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWfoStructuredSearchTableStyles = ({ theme, isDarkModeActive }: WfoThemeHelpers) => {
  const queryBuilderContainerStyles = css({
    backgroundColor: theme.colors.backgroundBaseSubdued,
    padding: theme.base / 2,
    marginBottom: theme.base,
    border: `thin solid ${theme.colors.borderBasePlain}`,
    borderRadius: theme.border.radius.small,
  });
  const toggleButtonStyles = css({
    backgroundColor: 'primary',
    padding: theme.base * 0.75,
  });

  const buttonGroupStyles = css({
    alignSelf: 'center',
    backgroundColor: 'transparent',
    height: theme.base * 2,
    '.euiButtonGroup__buttons': {
      backgroundColor: 'transparent',
      height: theme.base * 2,
      minHeight: theme.base * 2,
    },
    'button.euiButtonGroupButton': {
      height: theme.base * 2,
      minHeight: theme.base * 2,
      blockSize: theme.base * 2,
      borderRadius: 0,
      transition: 'none',
    },
    'button.euiButtonGroupButton:not(.euiButtonGroupButton-isSelected)': {
      backgroundColor: theme.colors.backgroundBasePlain,
    },
    'button.euiButtonGroupButton:first-of-type': {
      borderTopLeftRadius: theme.base,
      borderBottomLeftRadius: theme.base,
    },
    'button.euiButtonGroupButton:last-of-type': {
      borderTopRightRadius: theme.base,
      borderBottomRightRadius: theme.base,
    },
  });

  const ruleContainerStyles = css({
    '& > .rule': {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.base / 2,
      alignItems: 'center',
      marginBottom: theme.base / 4,
      marginTop: theme.base / 4,
    },
  });

  const ruleGroupContainerBase = {
    padding: theme.base / 2,
    border: `1px solid ${theme.colors.borderBaseSubdued}`,
  };

  const ruleGroupContainerBlueStyles = css({
    ...ruleGroupContainerBase,
    borderRadius: theme.border.radius.small,
    backgroundColor: isDarkModeActive ? theme.colors.backgroundLightPrimary : '#E9F1F9',
  });

  const ruleGroupContainerWhiteStyles = css({
    ...ruleGroupContainerBase,
    borderRadius: theme.border.radius.small,
    backgroundColor: theme.colors.backgroundBasePlain,
  });

  const innerGroupContainerWhiteStyles = css({
    ...ruleGroupContainerBase,
    borderBottomLeftRadius: theme.border.radius.small,
    borderTopLeftRadius: theme.border.radius.small,
    backgroundColor: theme.colors.backgroundBasePlain,
  });

  const innerGroupContainerBlueStyles = css({
    ...ruleGroupContainerBase,
    borderBottomLeftRadius: theme.border.radius.small,
    borderTopLeftRadius: theme.border.radius.small,
    backgroundColor: isDarkModeActive ? theme.colors.backgroundLightPrimary : '#E9F1F9',
  });

  const removeGroupActionStyles = css({
    backgroundColor: theme.colors.backgroundLightPrimary,
    width: '40px',
    height: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: theme.border.radius.small,
    borderTopRightRadius: theme.border.radius.small,
    border: `thin solid ${theme.colors.borderBasePlain}`,
    cursor: 'pointer',
  });

  const expandingSearchRowStyles = css({
    padding: theme.base / 2,
    height: theme.base * 2,
    borderRadius: theme.border.radius.medium,
    border: `thin solid ${theme.colors.highlight}`,
    backgroundColor: theme.colors.highlight,
  });
  const expandingRowBodyStyles = css({
    display: 'flex',
    justifyContent: 'space-between',
    // Size to the visible scroll viewport (minus the td padding) instead of
    // the full table width, and keep it pinned there on horizontal scroll
    position: 'sticky',
    left: theme.base / 2,
    width: `calc(100cqw - ${theme.base}px)`,
  });

  const addRulePlusStyles = css({
    fontSize: theme.size.l,
  });

  const addRuleContainerStyles = css({
    color: theme.colors.primary,
    size: theme.size.m,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.base / 2,
    alignSelf: 'end',
    cursor: 'pointer',
    marginRight: theme.base / 2,
  });

  const addGroupStyles = css({
    border: `thin dashed ${theme.colors.backgroundFilledPrimary}`,
    borderRadius: theme.border.radius.medium,
    alignItems: 'center',
    paddingBlock: theme.base / 3,
    paddingInline: theme.base,
    color: theme.colors.primary,
    justifyContent: 'center',
    flexDirection: 'row',
    cursor: 'pointer',
  });

  const inlineCombinatorStyles = css({
    alignSelf: 'start',
    transform: `translateY(calc(-50% - ${theme.base / 8}px))`,
  });

  const ruleGroupBodyGridStyles = css({
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: theme.base / 2,
    rowGap: theme.base / 4,
    alignItems: 'center',
    '& > :first-child': {
      gridColumn: '1 / -1',
    },
    '& > :first-child:not(:only-child)': {
      gridColumn: '2 / -1',
    },
  });

  const hideExpandedRowStyle = css({
    display: 'none',
  });
  const dotStyles = css({
    padding: theme.base / 4,
  });

  const expandingRowFieldStyles = css({
    display: 'flex',
    padding: theme.base / 4,
    alignItems: 'center',
  });

  return {
    toggleButtonStyles,
    queryBuilderContainerStyles,
    buttonGroupStyles,
    ruleContainerStyles,
    ruleGroupContainerBlueStyles,
    ruleGroupContainerWhiteStyles,
    innerGroupContainerWhiteStyles,
    innerGroupContainerBlueStyles,
    removeGroupActionStyles,
    expandingSearchRowStyles,
    expandingRowBodyStyles,
    addRulePlusStyles,
    addRuleContainerStyles,
    addGroupStyles,
    inlineCombinatorStyles,
    ruleGroupBodyGridStyles,
    hideExpandedRowStyle,
    expandingRowFieldStyles,
    dotStyles,
  };
};
