import React, { FC } from 'react';

import { useOrchestratorTheme } from '../../../hooks';
import { ProductLifecycleStatus } from '../../../types';
import { WfoBadge } from '../WfoBadge';

export type WfoProductStatusBadgeProps = {
    status: ProductLifecycleStatus;
};

export const WfoProductStatusBadge: FC<WfoProductStatusBadgeProps> = ({
    status,
}) => {
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

        switch (status.toLowerCase()) {
            case ProductLifecycleStatus.ACTIVE:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case ProductLifecycleStatus.END_OF_LIFE:
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
        <WfoBadge textColor={textColor} color={badgeColor}>
            {status.toLowerCase()}
        </WfoBadge>
    );
};
