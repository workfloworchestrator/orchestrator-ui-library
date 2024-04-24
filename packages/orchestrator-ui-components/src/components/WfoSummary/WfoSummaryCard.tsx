import React, { FC } from 'react';

import { EuiFlexItem, EuiSpacer } from '@elastic/eui';

import {
    SummaryCardButtonConfig,
    SummaryCardListItem,
    WfoSummaryCardHeader,
    WfoSummaryCardHeaderProps,
    WfoSummaryCardList,
} from '@/components';
import { getWfoSummaryCardsStyles } from '@/components/WfoSummary/styles';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';

export enum SummaryCardStatus {
    Success = 'Success',
    Error = 'Error',
    Neutral = 'Neutral',
}

export type WfoSummaryCardProps = {
    headerTitle: string;
    headerValue: string | number;
    headerStatus: SummaryCardStatus;
    listTitle: string;
    listItems: SummaryCardListItem[];
    button?: SummaryCardButtonConfig;
    isLoading?: boolean;
};

export const WfoSummaryCard: FC<WfoSummaryCardProps> = ({
    button,
    isLoading,
    headerStatus,
    headerValue,
    headerTitle,
    listTitle,
    listItems,
}) => {
    const { theme } = useOrchestratorTheme();
    const { cardContainerStyle } = useWithOrchestratorTheme(
        getWfoSummaryCardsStyles,
    );

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
