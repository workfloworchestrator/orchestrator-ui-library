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

export const getProcessActionStyles = ({ theme }: WfoThemeHelpers) => {
  const linkMenuItemStyle = css({
    '&>:hover': {
      backgroundColor: theme.colors.backgroundBasePlain,
      borderRadius: theme.border.radius.medium,
      cursor: 'pointer',
    },
    '.euiToolTipAnchor': {
      width: '100%',
    },
  });

  const iconStyle = css({
    width: theme.base * 2,
  });

  return {
    linkMenuItemStyle,
    iconStyle,
  };
};
