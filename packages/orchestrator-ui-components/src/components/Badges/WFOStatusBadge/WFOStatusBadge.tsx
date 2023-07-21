import { Badge } from '../Badge';
import { FC } from 'react';
import { useOrchestratorTheme } from '../../../hooks';

export type WFOStatusBadgeProps = {
    status: string;
};

export const WFOStatusBadge: FC<WFOStatusBadgeProps> = ({ status }) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromStatus = (status: string) => {
        const {
            primary,
            darkestShade,
            lightShade,
            primaryText,
            success,
            successText,
        } = theme.colors;

        switch (status) {
            case 'active':
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case 'terminated':
                return {
                    badgeColor: lightShade,
                    textColor: darkestShade,
                };

            default:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: primaryText,
                };
        }
    };

    const { badgeColor, textColor } = getBadgeColorFromStatus(status);

    return (
        <Badge textColor={textColor} color={badgeColor}>
            {status}
        </Badge>
    );
};
