import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getFormFieldsBaseStyle = ({ theme }: WfoThemeHelpers) => {
  const formFieldBaseStyle = css({
    // Use EUI's form tokens: the subdued/neutral surface greys look like EUI's disabled field (backgroundBaseDisabled)
    backgroundColor: theme.components.forms.background,
    color: theme.colors.textParagraph,
    '&:focus, &:focus-visible, &:focus-within': {
      backgroundColor: theme.components.forms.backgroundFocused,
      boxShadow: `0 0 0 1px ${theme.colors.primary}`,
    },
  });

  return {
    formFieldBaseStyle,
  };
};
