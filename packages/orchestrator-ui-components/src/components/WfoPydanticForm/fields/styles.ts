import { css } from '@emotion/react';

import type { WfoThemeHelpers } from '@/hooks';

export const getWfoObjectFieldStyles = () => {
  const wfoObjectFieldStyles = css({
    width: '100%',
    '& > div': {
      width: '100%',
    },
  });
  return {
    wfoObjectFieldStyles,
  };
};

export const getWfoCronFieldStyles = ({ theme }: WfoThemeHelpers) => {
  const cronFieldWrapperStyle = css({
    width: '100%',
  });

  const cronLegendStyle = css({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.size.xs,
    marginTop: theme.size.s,
    fontSize: theme.size.m,
  });

  const cronLegendItemStyle = css({
    color: theme.colors.textSubdued,
    padding: `0 ${theme.size.xs}`,
    borderRadius: theme.border.radius.small,
    border: 'none',
    backgroundColor: 'transparent',
    font: 'inherit',
    cursor: 'pointer',
  });

  const cronPossibleValuesStyle = css({
    marginTop: theme.size.m,
    marginLeft: theme.size.m,
    fontSize: theme.size.m,
    color: theme.colors.textSubdued,
  });

  const cronActiveLegendItemStyle = css({
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.backgroundBasePrimary,
    fontWeight: theme.font.weight.bold,
  });

  const cronInactiveLegendItemStyle = css({
    color: theme.colors.textDisabled,
    cursor: 'default',
  });

  const cronDescriptionStyle = css({
    color: theme.colors.textParagraph,
    fontWeight: theme.font.weight.semiBold,
  });

  const cronHintStyle = css({
    marginTop: theme.size.xs,
    color: theme.colors.textSubdued,
  });

  const cronHintListStyle = css({
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr',
    columnGap: theme.size.m,
    rowGap: theme.size.xxs,
    margin: theme.size.m,
    marginTop: theme.size.xs,
    fontSize: theme.size.m,
    color: theme.colors.textSubdued,
  });

  const cronHintSymbolStyle = css({
    fontFamily: theme.font.familyCode,
    color: theme.colors.textPrimary,
  });

  const cronErrorStyle = css({
    marginTop: theme.size.xs,
    color: theme.colors.textDanger,
  });
  const cronDescriptionContainerStyle = css({
    border: `thin dotted ${theme.colors.borderBasePlain}`,
    borderRadius: theme.border.radius.small,
    padding: theme.size.m,
  });
  return {
    cronFieldWrapperStyle,
    cronLegendStyle,
    cronLegendItemStyle,
    cronActiveLegendItemStyle,
    cronInactiveLegendItemStyle,
    cronDescriptionStyle,
    cronHintStyle,
    cronHintListStyle,
    cronHintSymbolStyle,
    cronErrorStyle,
    cronPossibleValuesStyle,
    cronDescriptionContainerStyle,
  };
};

export const getCommonFormFieldStyles = ({ theme }: WfoThemeHelpers) => {
  const formRowStyle = css({
    marginBottom: theme.base * 2,

    '.euiText': {
      color: theme.colors.textParagraph,
    },
    '.euiFormLabel': {
      color: theme.colors.textParagraph,
      cursor: 'text',
      '&.euiFormLabel-isFocused': {
        color: theme.colors.textPrimary,
      },
    },
    '.euiFormRow__labelWrapper': {
      display: 'flex',
      flexDirection: 'column',
    },
  });

  const errorStyle = css({
    color: theme.colors.textDanger,
  });
  return {
    errorStyle,
    formRowStyle,
  };
};

export const summaryFieldStyles = ({ theme }: WfoThemeHelpers) => {
  const summaryFieldStyle = css({
    'div.emailMessage': {
      td: {
        color: theme.colors.textParagraph,
      },
      p: {
        color: theme.colors.textParagraph,
      },
      html: {
        marginLeft: '-10px',
      },
    },
    'section.table-summary': {
      marginTop: '20px',
      width: '100%',
      td: {
        padding: '10px',
        verticalAlign: 'top',
      },
      'td:not(:first-child):not(:last-child)': {
        borderRight: `1px solid ${theme.colors.borderBasePlain}`,
      },
      '.label': {
        fontWeight: 'bold',
        color: theme.colors.backgroundBaseNeutral,
        backgroundColor: theme.colors.primary,
        borderRight: `2px solid ${theme.colors.borderBasePlain}`,
        borderBottom: `1px solid ${theme.colors.borderBasePlain}`,
      },
      '.value': {
        backgroundColor: theme.colors.backgroundBasePrimary,
        borderBottom: `1px solid ${theme.colors.borderBasePlain}`,
      },
    },
  });
  return {
    summaryFieldStyle: summaryFieldStyle,
  };
};
