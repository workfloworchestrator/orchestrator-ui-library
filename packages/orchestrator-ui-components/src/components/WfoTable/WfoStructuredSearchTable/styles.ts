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
    border: `thin solid ${theme.colors.primary}`,
    borderRadius: theme.border.radius.small,
    backgroundColor: theme.colors.backgroundLightPrimary,
  };

  const ruleGroupContainerBlueStyles = css({
    ...ruleGroupContainerBase,
    backgroundColor: theme.colors.backgroundLightPrimary,
  });

  const ruleGroupContainerWhiteStyles = css({
    ...ruleGroupContainerBase,
    backgroundColor: theme.colors.backgroundBasePlain,
  });

  const removeGroupActionStyles = css({
    justifyContent: 'center',
    marginLeft: theme.base / 2,
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
    span: {
      fontWeight: 'bold',
    },
  });

  return {
    toggleButtonStyles,
    queryBuilderContainerStyles,
    textAreaStyles,
    buttonGroupStyles,
    ruleContainerStyles,
    ruleGroupContainerBlueStyles,
    ruleGroupContainerWhiteStyles,
    removeGroupActionStyles,
    expandingSearchRowStyles,
    expandingRowBodyStyles,
  };
};
