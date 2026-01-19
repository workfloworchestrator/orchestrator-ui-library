import React, { FC } from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { ProcessStatus } from '@/types';

import { WfoBadge } from '../WfoBadge';

export type WfoProcessStatusBadgeProps = {
    processStatus: ProcessStatus;
};

export const WfoProcessStatusBadge: FC<WfoProcessStatusBadgeProps> = ({
    processStatus,
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromProcessStatus = (status: ProcessStatus) => {
        const {
            primary,
            danger,
            textDanger,
            borderBaseSubdued,
            textPrimary,
            success,
            textSuccess,
            textParagraph,
            warning,
            textWarning,
        } = theme.colors;

        switch (status.toLowerCase()) {
            case ProcessStatus.COMPLETED:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: textSuccess,
                };
            case ProcessStatus.FAILED:
            case ProcessStatus.ABORTED:
                return {
                    badgeColor: toSecondaryColor(danger),
                    textColor: textDanger,
                };
            case ProcessStatus.SUSPENDED:
                return {
                    badgeColor: toSecondaryColor(warning),
                    textColor: textWarning,
                };
            case ProcessStatus.CREATED:
                return {
                    badgeColor: borderBaseSubdued,
                    textColor: textParagraph,
                };
            case ProcessStatus.WAITING:
            case ProcessStatus.RESUMED:
            case ProcessStatus.RUNNING:
            case ProcessStatus.API_UNAVAILABLE:
            case ProcessStatus.INCONSISTENT_DATA:
            default:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: textPrimary,
                };
        }
    };

    const { badgeColor, textColor } =
        getBadgeColorFromProcessStatus(processStatus);

    return (
        <WfoBadge textColor={textColor} color={badgeColor}>
            {processStatus.toLowerCase()}
        </WfoBadge>
    );
};
