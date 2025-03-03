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
import { WfoCheckmarkCircleFill, WfoCubeFill, WfoXCircleFill } from '@/icons';

export enum SummaryCardStatus {
    Success = 'Success',
    Error = 'Error',
    Neutral = 'Neutral',
}

export type WfoSummaryCardProps = {
    headerTitle: string;
    headerValue: string | number;
    listTitle: string;
    listItems: SummaryCardListItem[];
    headerStatus?: SummaryCardStatus;
    button?: SummaryCardButtonConfig;
    isLoading?: boolean;
    headerBadge?: Pick<WfoSummaryCardHeaderProps, 'iconType' | 'iconColor'>;
};

export const WfoSummaryCard: FC<WfoSummaryCardProps> = ({
    button,
    isLoading,
    headerStatus,
    headerValue,
    headerTitle,
    listTitle,
    listItems,
    headerBadge,
}) => {
    const { theme } = useOrchestratorTheme();
    const { cardContainerStyle } = useWithOrchestratorTheme(
        getWfoSummaryCardsStyles,
    );

    const getIconTypeAndColorForHeaderStatus = (
        status?: SummaryCardStatus,
    ): Pick<WfoSummaryCardHeaderProps, 'iconType' | 'iconColor'> => {
        switch (status) {
            case SummaryCardStatus.Success:
                return {
                    iconType: () => (
                        <WfoCheckmarkCircleFill
                            width={32}
                            height={32}
                            color={theme.colors.ghost}
                        />
                    ),
                    iconColor: theme.colors.success,
                };
            case SummaryCardStatus.Error:
                return {
                    iconType: () => (
                        <WfoXCircleFill
                            width={32}
                            height={32}
                            color={theme.colors.ghost}
                        />
                    ),
                    iconColor: theme.colors.danger,
                };
            case SummaryCardStatus.Neutral:
                return {
                    iconType: () => (
                        <WfoCubeFill
                            width={32}
                            height={32}
                            color={theme.colors.ghost}
                        />
                    ),
                    iconColor: theme.colors.primary,
                };
            default:
                return (
                    headerBadge ?? {
                        iconType: () => (
                            <WfoCubeFill
                                width={32}
                                height={32}
                                color={theme.colors.ghost}
                            />
                        ),
                        iconColor: theme.colors.primary,
                    }
                );
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
