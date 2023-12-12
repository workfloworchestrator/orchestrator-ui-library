import React, { FC } from 'react';

import {
    EuiFlexGrid,
    EuiFlexItem,
    EuiSpacer,
    useCurrentEuiBreakpoint,
} from '@elastic/eui';

import { WfoSummaryCardHeader } from '@/components/WfoSummary/WfoSummaryCardHeader';
import { useOrchestratorTheme } from '@/hooks';

import { SummaryCardListItem, WfoSummaryCardList } from './WfoSummaryCardList';
import { getNumberOfColumns } from './getNumberOfColumns';

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
    buttonName: string;
    buttonUrl: string;
};

export type WfoSummaryCardsProps = {
    summaryCards: SummaryCard[];
};

// Todo: can be one or more
export const WfoSummaryCards: FC<WfoSummaryCardsProps> = ({ summaryCards }) => {
    // todo: List component with button
    const { theme } = useOrchestratorTheme();
    const currentBreakpoint = useCurrentEuiBreakpoint();

    return (
        <EuiFlexGrid
            responsive={false}
            columns={getNumberOfColumns(currentBreakpoint)}
        >
            {summaryCards.map((summaryCard, index) => {
                const {
                    headerTitle,
                    headerValue,
                    headerStatus, // todo: use status to determine icon and icon color
                    listTitle,
                    listItems,
                    buttonName,
                    buttonUrl,
                } = summaryCard;
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
                            buttonName={buttonName}
                            buttonUrl={buttonUrl}
                        />
                    </EuiFlexItem>
                );
            })}
        </EuiFlexGrid>
    );
};
