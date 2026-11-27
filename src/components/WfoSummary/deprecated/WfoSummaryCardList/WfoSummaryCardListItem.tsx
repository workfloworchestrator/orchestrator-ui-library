import React, { FC, ReactNode } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiTextColor } from '@elastic/eui';

import { WfoOptionalLink } from '@/components/WfoOptionalLink';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { warnDeprecated } from '@/utils/warnDeprecated';

import { getWfoSummaryCardListStyles } from './styles';

export type WfoSummaryCardListItemProps = {
  title: string;
  value: ReactNode;
  url?: string;
};

/** @deprecated Use `WfoListItem` inside a `WfoList`, with a `WfoLink` for a link. Will be removed in the next major version. */
export const WfoSummaryCardListItem: FC<WfoSummaryCardListItemProps> = ({ title, value, url }) => {
  warnDeprecated('WfoSummaryCardListItem', 'Use WfoListItem inside a WfoList, with a WfoLink for a link.');
  const { theme } = useOrchestratorTheme();
  const { listItemContainerStyle, listItemTitleStyle, listItemSubtitleStyle, listItemHighlightIconStyle } =
    useWithOrchestratorTheme(getWfoSummaryCardListStyles);

  return (
    <WfoOptionalLink href={url}>
      <EuiFlexGroup css={listItemContainerStyle} gutterSize="none">
        <EuiFlexItem>
          <EuiTextColor color={url ? theme.colors.link : theme.colors.textHeading} css={listItemTitleStyle}>
            {title}
          </EuiTextColor>
          <EuiTextColor css={listItemSubtitleStyle}>{value}</EuiTextColor>
        </EuiFlexItem>
        <EuiFlexItem className={url ? 'highlight-icon' : undefined} grow={false} css={listItemHighlightIconStyle}>
          <EuiIcon type="sortRight" color="primary" />
        </EuiFlexItem>
      </EuiFlexGroup>
    </WfoOptionalLink>
  );
};
