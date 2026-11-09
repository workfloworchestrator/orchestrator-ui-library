import React, { forwardRef } from 'react';

import { EuiTabs, type EuiTabsProps } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getWfoTabsStyles } from './styles';

export type WfoTabsProps = EuiTabsProps;

/**
 * Drop-in replacement for `EuiTabs` that keeps the pre-EUI-122 tab styling.
 *
 * The styling is applied to a wrapper element instead of to `EuiTabs` directly, because passing a
 * `css` prop to `EuiTabs` replaces its own styles rather than merging with them. See `./styles.ts`.
 */
export const WfoTabs = forwardRef<HTMLDivElement, WfoTabsProps>(({ children, ...euiTabsProps }, ref) => {
  const { tabsWrapperStyle } = useWithOrchestratorTheme(getWfoTabsStyles);

  return (
    <div css={tabsWrapperStyle}>
      <EuiTabs ref={ref} {...euiTabsProps}>
        {children}
      </EuiTabs>
    </div>
  );
});

WfoTabs.displayName = 'WfoTabs';
