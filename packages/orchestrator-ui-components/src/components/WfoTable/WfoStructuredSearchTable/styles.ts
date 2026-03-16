//import { tint } from '@elastic/eui';
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
    padding: '12px',
    marginLeft: theme.base,
  });

  const textAreaStyles = css({
    width: '100%',
    maxInlineSize: '100%',
  });

  return {
    toggleButtonStyles,
    queryBuilderContainerStyles,
    textAreaStyles,
  };
};
