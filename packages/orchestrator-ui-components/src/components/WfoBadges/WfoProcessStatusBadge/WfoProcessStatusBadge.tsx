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
            dangerText,
            lightShade,
            primaryText,
            success,
            successText,
            text,
            warning,
            warningText,
        } = theme.colors;

        switch (status.toLowerCase()) {
            case ProcessStatus.COMPLETED:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case ProcessStatus.FAILED:
            case ProcessStatus.ABORTED:
                return {
                    badgeColor: toSecondaryColor(danger),
                    textColor: dangerText,
                };
            case ProcessStatus.SUSPENDED:
                return {
                    badgeColor: toSecondaryColor(warning),
                    textColor: warningText,
                };
            case ProcessStatus.CREATED:
                return {
                    badgeColor: lightShade,
                    textColor: text,
                };
            case ProcessStatus.WAITING:
            case ProcessStatus.RESUMED:
            case ProcessStatus.RUNNING:
            case ProcessStatus.API_UNAVAILABLE:
            case ProcessStatus.INCONSISTENT_DATA:
            default:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: primaryText,
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
