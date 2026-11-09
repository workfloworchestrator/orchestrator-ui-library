import { transparentize } from '@elastic/eui';
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

  const formStyle = css({
    '.euiFormRow .euiFormRow__labelWrapper': {
      flexBasis: '50%',
    },
    '.euiFormRow .euiFormRow__fieldWrapper': {
      flexBasis: '50%',
    },
  });

  const { theme } = wfoThemeHelpers;

  const columnsListStyle = css({
    maxHeight: theme.base * 16,
    overflowY: 'auto',
    paddingLeft: theme.base / 4,
    marginBottom: theme.base / 2,
    backgroundImage: `linear-gradient(to top, ${theme.colors.textGhost} ${theme.base}px, transparent),
      radial-gradient(farthest-side at 50% 100%, ${transparentize(theme.colors.shadow, 0.24)}, transparent)`,
    backgroundPosition: `center bottom, center bottom -${theme.base / 2}px`,
    backgroundSize: `100% ${theme.base * 2}px, 100% ${theme.base}px`,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'local, scroll',
  });

  return {
    formStyle,
    formRowStyle,
    columnsListStyle,
    selectFieldStyle: formFieldBaseStyle,
  };
};
