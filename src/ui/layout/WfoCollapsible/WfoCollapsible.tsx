import React, { FC, ReactNode, forwardRef } from 'react';

import { Collapsible } from '@base-ui/react/collapsible';

import { WfoChevronDown } from '@/icons';

import styles from './WfoCollapsible.module.css';

export type WfoCollapsibleRootProps = Collapsible.Root.Props;

/**
 * Holds the open state. Use `open` and `onOpenChange` to control it, or `defaultOpen` to let it control itself.
 * A thin wrapper, so React DevTools and Storybook show the Wfo name.
 */
export const WfoCollapsibleRoot = forwardRef<HTMLDivElement, WfoCollapsibleRootProps>((rootProps, ref) => (
  <Collapsible.Root ref={ref} {...rootProps} />
));
WfoCollapsibleRoot.displayName = 'WfoCollapsibleRoot';

export type WfoCollapsibleTriggerProps = { label: string };

/** Icon-only chevron button. The chevron turns up while the panel is open. */
export const WfoCollapsibleTrigger: FC<WfoCollapsibleTriggerProps> = ({ label }) => (
  <Collapsible.Trigger aria-label={label} className={styles.trigger}>
    <WfoChevronDown width={32} height={32} color="currentColor" />
  </Collapsible.Trigger>
);

export type WfoCollapsiblePanelProps = { children: ReactNode };

/** Panel with a divider line on top. It scrolls when it gets taller than the design token allows. */
export const WfoCollapsiblePanel: FC<WfoCollapsiblePanelProps> = ({ children }) => (
  <Collapsible.Panel className={styles.panel}>{children}</Collapsible.Panel>
);
