import React, { FC } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';

import { WfoSummaryCardHeader } from '@/components/WfoSummary/WfoSummaryCardHeader';
import { useOrchestratorTheme } from '@/hooks';

import { SummaryCardListItem, WfoSummaryCardList } from './WfoSummaryCardList';

export enum SummaryCardStatus {
    Success = 'Success',
    Error = 'Error',
    Neutral = 'Neutral',
}

export type SummaryCard = {
    headerTitle: string;
    headerValue: string | number;
    headerStatus: SummaryCardStatus;
    listTitle: string;
    listItems: SummaryCardListItem[];
};

export type WfoSummaryCardsProps = {
    summaryCards: SummaryCard[];
};

// Todo: can be one or more
export const WfoSummaryCards: FC<WfoSummaryCardsProps> = ({ summaryCards }) => {
    // todo: List component with button
    const { theme } = useOrchestratorTheme();

    return (
        <EuiFlexGroup wrap>
            {summaryCards.map(
                (
                    {
                        headerTitle,
                        headerValue,
                        headerStatus, // todo: use status to determine icon and icon color
                        listTitle,
                        listItems,
                    },
                    index,
                ) => {
                    return (
                        <EuiFlexItem key={index}>
                            <WfoSummaryCardHeader
                                text={headerTitle}
                                value={headerValue}
                                iconType="kubernetesPod"
                                iconColor={theme.colors.primary}
                            />
                            <EuiSpacer />
                            <WfoSummaryCardList
                                title={listTitle}
                                items={listItems}
                                buttonName="View"
                            />
                        </EuiFlexItem>
                    );
                },
            )}
        </EuiFlexGroup>
    );
};
