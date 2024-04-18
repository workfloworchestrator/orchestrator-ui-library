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

// Todo: these are basically the props -- rename to WfoSummaryCardProps
export type SummaryCard = {
    headerTitle: string;
    headerValue: string | number;
    headerStatus: SummaryCardStatus;
    listTitle: string;
    listItems: SummaryCardListItem[];
    button?: SummaryCardButtonConfig;
    isLoading?: boolean;
};

export type WfoSummaryCardsProps = {
    summaryCards: SummaryCard[];
};

export const WfoSummaryCards: FC<WfoSummaryCardsProps> = ({ summaryCards }) => {
    const currentBreakpoint = useCurrentEuiBreakpoint();

    return (
        <EuiFlexGrid
            responsive={false}
            columns={getNumberOfColumns(currentBreakpoint)}
            gutterSize="xl"
        >
            {summaryCards.map((summaryCard, index) => (
                <WfoSummaryCard key={index} {...summaryCard} />
            ))}
        </EuiFlexGrid>
    );
};

export const WfoSummaryCard: FC<SummaryCard> = ({
    button,
    isLoading,
    headerStatus,
    headerValue,
    headerTitle,
    listTitle,
    listItems,
}) => {
    const { theme } = useOrchestratorTheme();
    const { cardContainerStyle } = getWfoSummaryCardsStyles(theme);

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
        <EuiFlexItem css={cardContainerStyle}>
            <WfoSummaryCardHeader
                text={headerTitle}
                value={headerValue}
                {...getIconTypeAndColorForHeaderStatus(headerStatus)}
            />
            <EuiSpacer size="m" />
            <WfoSummaryCardList
                title={listTitle}
                items={listItems}
                button={button}
                isLoading={isLoading}
            />
        </EuiFlexItem>
    );
};
