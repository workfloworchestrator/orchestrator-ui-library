import { FC } from 'react';
import { useOrchestratorTheme } from '../../../hooks';
import { Badge } from '../Badge';

export type ProcessStatusBadgeProps = {
    processStatus: string;
};

export const ProcessStatusBadge: FC<ProcessStatusBadgeProps> = ({
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
        <Badge textColor={textColor} color={badgeColor}>
            {processStatus}
        </Badge>
    );
};
