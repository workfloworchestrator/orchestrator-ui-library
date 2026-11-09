import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWfoButtonComboBoxStyles = ({ theme }: WfoThemeHelpers) => {
  const selectableStyle = css({
    '.euiFieldSearch': {
      backgroundColor: theme.colors.backgroundBasePlain,
      color: theme.colors.textParagraph,
      '&:focus': {
        backgroundColor: theme.colors.backgroundBaseNeutral,
      },
    },

    /*
     * EUI 122 dropped the EuiSelectableListItem styles in favour of the shared EuiListItemLayout,
     * losing the divider between items and the primary coloured, underlined hover state, and
     * rounding the hover background. This restores the EUI 113 look.
     */
    '.euiSelectableList .euiSelectableListItem': {
      borderRadius: 0,
      '&:not(:last-of-type)': {
        borderBottom: `${theme.border.width.thin} solid ${theme.colors.borderBaseSubdued}`,
      },
      '&:hover, &.euiSelectableListItem-isFocused': {
        "&:not([aria-disabled='true'])": {
          color: theme.colors.textPrimary,
          '.euiSelectableListItem__text': {
            textDecoration: 'underline',
          },
        },
      },
    },
  });

  const titleStyle = css({
    fontWeight: theme.font.weight.semiBold,
  });

  return {
    selectableStyle,
    titleStyle,
  };
};
