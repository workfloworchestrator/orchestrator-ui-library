import React from 'react';

import { useOrchestratorTheme } from '../../../hooks';
import { BadgeType } from '../../../types';
import { WfoBadge } from '../WfoBadge';

export type WfoProductBlockBadgeProps = {
    children: string;
    badgeType: BadgeType;
};

export function WfoProductBlockBadge({
    children,
    badgeType,
}: WfoProductBlockBadgeProps) {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromType = (badgeType: BadgeType) => {
        const {
            danger,
            dangerText,
            lightShade,
            primary,
            primaryText,
            success,
            successText,
            text,
            warning,
            warningText,
        } = theme.colors;

        switch (badgeType) {
            case BadgeType.RESOURCE_TYPE:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case BadgeType.PRODUCT_BLOCK_TAG:
            case BadgeType.PRODUCT_BLOCK:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: primaryText,
                };
            case BadgeType.WORKFLOW:
                return {
                    badgeColor: toSecondaryColor(danger),
                    textColor: dangerText,
                };
            case BadgeType.FIXED_INPUT:
                return {
                    badgeColor: toSecondaryColor(warning),
                    textColor: warningText,
                };
            case BadgeType.PRODUCT_TAG:
            default:
                return {
                    badgeColor: lightShade,
                    textColor: text,
                };
        }
    };

    const { badgeColor, textColor } = getBadgeColorFromType(badgeType);

    return (
        <WfoBadge textColor={textColor} color={badgeColor}>
            {children}
        </WfoBadge>
    );
}
