import React, { FC, ReactNode } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiTextColor } from '@elastic/eui';

import { WfoOptionalLink } from '@/components/WfoOptionalLink';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';

import { getWfoSummaryCardListStyles } from './styles';

export type SummaryCardListItem = {
    title: string;
    value: ReactNode;
    url?: string;
};

export type WfoSummaryCardListItemProps = {
    title: string;
    value: ReactNode;
    url?: string;
};

export const WfoSummaryCardListItem: FC<WfoSummaryCardListItemProps> = ({
    title,
    value,
    url,
}) => {
    const { theme } = useOrchestratorTheme();
    const {
        listItemContainerStyle,
        listItemTitleStyle,
        listItemSubtitleStyle,
        listItemHighlightIconStyle,
    } = useWithOrchestratorTheme(getWfoSummaryCardListStyles);

    return (
        <WfoOptionalLink href={url}>
            <EuiFlexGroup css={listItemContainerStyle} gutterSize="none">
                <EuiFlexItem>
                    <EuiTextColor
                        color={
                            url ? theme.colors.link : theme.colors.textHeading
                        }
                        css={listItemTitleStyle}
                    >
                        {title}
                    </EuiTextColor>
                    <EuiTextColor css={listItemSubtitleStyle}>
                        {value}
                    </EuiTextColor>
                </EuiFlexItem>
                <EuiFlexItem
                    className={url ? 'highlight-icon' : undefined}
                    grow={false}
                    css={listItemHighlightIconStyle}
                >
                    <EuiIcon type="sortRight" color="primary" />
                </EuiFlexItem>
            </EuiFlexGroup>
        </WfoOptionalLink>
    );
};
