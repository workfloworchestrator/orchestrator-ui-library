import React from 'react';

import { EuiIcon, IconType } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

// New layout only. A small tab tucked against the right edge of a panel, to open something that sits behind the panel.

export const EDGE_TAB_WIDTH = 32;
export const EDGE_TAB_MIN_HEIGHT = 120;

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
  const gap = inset ?? theme.size.m;

  return (
    <button
      type="button"
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-label={label}
      title={label}
      onClick={onClick}
      css={{
        width: attached ? '100%' : `calc(100% - ${gap})`,
        marginInlineStart: attached ? 0 : gap,
        display: 'grid',
        alignSelf: 'center',
        placeItems: 'center',
        ...(size === 'tall' ?
          { height: `calc(100% - 2 * ${gap})`, minHeight: EDGE_TAB_MIN_HEIGHT, marginBlock: gap }
        : { padding: `${theme.size.l} 0` }),
        background: theme.colors.backgroundBasePrimary,
        border: `2px solid ${theme.colors.backgroundLightPrimary}`,
        // Attached: against the panel, no left border, round on the right only
        borderInlineStart: attached ? 0 : undefined,
        borderRadius:
          attached ? `0 ${theme.border.radius.medium} ${theme.border.radius.medium} 0` : theme.border.radius.medium,
        cursor: 'pointer',
        transition: 'border-color 100ms ease-in-out, background-color 100ms ease-in-out',
        '&:hover': {
          borderColor: theme.colors.borderBasePrimary,
          backgroundColor: theme.colors.backgroundLightPrimary,
        },
      }}
    >
      <EuiIcon type={icon} size="l" color="primary" />
    </button>
  );
};
