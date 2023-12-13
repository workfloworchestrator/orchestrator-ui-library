import React, { FC } from 'react';

import {
    EuiFlexGrid,
    EuiFlexItem,
    EuiSpacer,
    useCurrentEuiBreakpoint,
} from '@elastic/eui';

import {
    WfoSummaryCardHeader,
    WfoSummaryCardHeaderProps,
} from '@/components/WfoSummary/WfoSummaryCardHeader';
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

export const WfoSummaryCards: FC<WfoSummaryCardsProps> = ({ summaryCards }) => {
    const { theme } = useOrchestratorTheme();
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
                        buttonName,
                        buttonUrl,
                    },
                    index,
                ) => (
                    <EuiFlexItem
                        key={index}
                        css={{
                            height: theme.base * 36,
                            minWidth: theme.base * 25,
                        }}
                    >
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
                            buttonName={buttonName}
                            buttonUrl={buttonUrl}
                        />
                    </EuiFlexItem>
                ),
            )}
        </EuiFlexGrid>
    );
};
