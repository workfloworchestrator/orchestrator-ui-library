import { WFOBadge } from '../WFOBadge';
import React from 'react';
import { useOrchestratorTheme } from '../../../hooks';
import { BadgeType } from '../../../types';

export type WFOProductBlockBadgeProps = {
    children: string;
    badgeType: BadgeType;
};

export function WFOProductBlockBadge({
    children,
    badgeType,
}: WFOProductBlockBadgeProps) {
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
        <WFOBadge textColor={textColor} color={badgeColor}>
            {children}
        </WFOBadge>
    );
}
