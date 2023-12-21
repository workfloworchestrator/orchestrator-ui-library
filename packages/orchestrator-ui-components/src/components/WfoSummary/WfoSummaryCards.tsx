import React, { FC } from 'react';

import {
    EuiFlexGrid,
    EuiFlexItem,
    EuiSpacer,
    useCurrentEuiBreakpoint,
} from '@elastic/eui';

import {
    SummaryCardListItem,
    WfoSummaryCardHeader,
    WfoSummaryCardHeaderProps,
} from '@/components/WfoSummary/';
import { getWfoSummaryCardsStyles } from '@/components/WfoSummary/styles';
import { useOrchestratorTheme } from '@/hooks';

import {
    SummaryCardButtonConfig,
    WfoSummaryCardList,
} from './WfoSummaryCardList/WfoSummaryCardList';
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
    button?: SummaryCardButtonConfig;
};

export type WfoSummaryCardsProps = {
    summaryCards: SummaryCard[];
};

export const WfoSummaryCards: FC<WfoSummaryCardsProps> = ({ summaryCards }) => {
    const { theme } = useOrchestratorTheme();
    const { cardContainerStyle } = getWfoSummaryCardsStyles(theme);
    const currentBreakpoint = useCurrentEuiBreakpoint();

    const getIconTypeAndColorForHeaderStatus = (
        status: SummaryCardStatus,
    ): Pick<WfoSummaryCardHeaderProps, 'iconType' | 'iconColor'> => {
        switch (status) {
            case SummaryCardStatus.Success:
                return {
                    iconType: 'checkInCircleFilled',
                    iconColor: theme.colors.success,
                };
            case SummaryCardStatus.Error:
                return {
                    iconType: 'error',
                    iconColor: theme.colors.danger,
                };
            case SummaryCardStatus.Neutral:
            default:
                return {
                    iconType: 'kubernetesPod',
                    iconColor: theme.colors.primary,
                };
        }
    };

    return (
        <EuiFlexGrid
            responsive={false}
            columns={getNumberOfColumns(currentBreakpoint)}
            gutterSize="xl"
        >
            {summaryCards.map(
                (
                    {
                        headerTitle,
                        headerValue,
                        headerStatus,
                        listTitle,
                        listItems,
                        button,
                    },
                    index,
                ) => (
                    <EuiFlexItem key={index} css={cardContainerStyle}>
                        <WfoSummaryCardHeader
                            text={headerTitle}
                            value={headerValue}
                            {...getIconTypeAndColorForHeaderStatus(
                                headerStatus,
                            )}
                        />
                        <EuiSpacer size="m" />
                        <WfoSummaryCardList
                            title={listTitle}
                            items={listItems}
                            button={button}
                        />
                    </EuiFlexItem>
                ),
            )}
        </EuiFlexGrid>
    );
};
