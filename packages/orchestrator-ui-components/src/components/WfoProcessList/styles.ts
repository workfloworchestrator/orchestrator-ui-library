import { css } from '@emotion/react';

import { WfoThemeHelpers } from '@/hooks';

export const getWfoProcessListDeltaPopoverStyles = ({ theme }: WfoThemeHelpers) => {
  const popoverPanelStyle = {
    backgroundColor: `${theme.colors.backgroundBasePlain}DD`,
    boxShadow: 'none',
    backdropFilter: 'blur(2px)',
  };

  const deltaContentPanelStyle = css({
    backgroundColor: 'transparent',
    width: '1300px',
    height: '500px',
    overflow: 'auto',
  });

  const loadingSpinnerStyle = css({
    padding: theme.size.m,
  });

  return {
    popoverPanelStyle,
    deltaContentPanelStyle,
    loadingSpinnerStyle,
  };
};
