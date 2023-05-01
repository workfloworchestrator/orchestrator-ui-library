import { Badge } from './Badge';
import { FC } from 'react';
import { useOrchestratorTheme } from '../../hooks';

export type SubscriptionStatusBadgeProps = {
    subscriptionStatus: string;
};

export const SubscriptionStatusBadge: FC<SubscriptionStatusBadgeProps> = ({
    subscriptionStatus,
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromSubscriptionStatus = (status: string) => {
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

    const { badgeColor, textColor } =
        getBadgeColorFromSubscriptionStatus(subscriptionStatus);

    return (
        <Badge textColor={textColor} color={badgeColor}>
            {subscriptionStatus}
        </Badge>
    );
};
