import React from 'react';

import { EuiIcon, IconType } from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';

import { EDGE_TAB_WIDTH, getEdgeTabStyles } from './styles';

// New layout only. A small tab tucked against the right edge of a panel, to open something that sits behind the panel.

export { EDGE_TAB_WIDTH };

export type WfoEdgeTabProps = {
  icon: IconType;
  /** Tooltip and screen reader name (the tab has no visible text) */
  label: string;
  onClick: () => void;
  /** tall: as high as the box it sits in, minus the inset (a big target). compact: only as high as its icon. */
  size?: 'tall' | 'compact';
  /** Gap above and below a tall tab, so it reads as a tab and not as part of the panel edge */
  inset?: string;
  /** true: touches the panel on its left (no left border, round on the right). false: floats free, for content without a panel. */
  attached?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
};

/*
 * Put it in a box that has the height you want (a tall tab fills the box). The box decides where the tab sits:
 * make it sticky to keep the tab in view on a long page.
 */
export const WfoEdgeTab = ({
  icon,
  label,
  onClick,
  size = 'tall',
  inset,
  attached = true,
  ariaExpanded,
  ariaControls,
}: WfoEdgeTabProps) => {
  const { theme } = useOrchestratorTheme();
  const { getEdgeTabStyle } = useWithOrchestratorTheme(getEdgeTabStyles);
  const gap = inset ?? theme.size.m;

  return (
    <button
      type="button"
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-label={label}
      title={label}
      onClick={onClick}
      css={getEdgeTabStyle({ size, attached, gap })}
    >
      <EuiIcon type={icon} size="l" color="primary" />
    </button>
  );
};
