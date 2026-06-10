import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWfoStructuredSearchTableStyles = ({ theme }: WfoThemeHelpers) => {
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
    marginLeft: theme.base,
  });

  const textAreaStyles = css({
    width: '100%',
    maxInlineSize: '100%',
  });

  const buttonGroupStyles = css({
    backgroundColor: theme.colors.textGhost,
    height: '100%',
    borderRadius: theme.border.radius.small,
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
    marginTop: theme.base / 4,
  };

  const ruleGroupContainerBlueStyles = css({
    ...ruleGroupContainerBase,
    borderRadius: theme.border.radius.small,
    backgroundColor: '#E9F1F9',
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
    backgroundColor: '#E9F1F9',
  });

  const removeGroupActionStyles = css({
    backgroundColor: theme.colors.backgroundLightPrimary,
    width: '40px',
    marginTop: theme.base / 4,
    height: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: theme.border.radius.small,
    borderTopRightRadius: theme.border.radius.small,
    cursor: 'pointer',
  });

  const expandingSearchRowStyles = css({
    padding: theme.base / 2,
    height: theme.base * 2,
    borderRadius: theme.border.radius.medium,
    border: 'thin solid FEF7E0',
    backgroundColor: '#FEF7E0',
  });
  const expandingRowBodyStyles = css({
    display: 'flex',
    gap: theme.base,
    fontWeight: theme.font.weight.bold,
    span: {
      fontWeight: 'bold',
    },
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
    padding: theme.base,
    color: theme.colors.primary,
    justifyContent: 'center',
    flexDirection: 'row',
    cursor: 'pointer',
  });

  return {
    toggleButtonStyles,
    queryBuilderContainerStyles,
    textAreaStyles,
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
  };
};
