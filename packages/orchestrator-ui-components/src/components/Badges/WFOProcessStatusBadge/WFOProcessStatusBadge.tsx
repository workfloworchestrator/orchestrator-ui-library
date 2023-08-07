import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../../hooks';
import { WFOBadge } from '../WFOBadge';

export type WFOProcessStatusBadgeProps = {
    processStatus: string;
};

export const WFOProcessStatusBadge: FC<WFOProcessStatusBadgeProps> = ({
    processStatus,
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromProcessStatus = (status: string) => {
        const { primary, lightShade, primaryText, success, successText } =
            theme.colors;

        switch (status) {
            case 'completed':
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case 'failed':
                return {
                    badgeColor: 'danger',
                    textColor: lightShade,
                };

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
        <WFOBadge textColor={textColor} color={badgeColor}>
            {processStatus}
        </WFOBadge>
    );
};
