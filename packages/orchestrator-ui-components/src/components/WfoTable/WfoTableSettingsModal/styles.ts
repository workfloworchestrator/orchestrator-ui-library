import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';

export const getWfoTableSettingsModalStyles = (wfoThemeHelpers: WfoThemeHelpers) => {
  const { formFieldBaseStyle } = getFormFieldsBaseStyle(wfoThemeHelpers);

  const formRowStyle = css({
    justifyContent: 'space-between',
    '.euiFormLabel': {
      color: wfoThemeHelpers.theme.colors.textParagraph,
    },
  });

  return {
    formRowStyle,
    selectFieldStyle: formFieldBaseStyle,
  };
};
