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
            case BadgeType.RESOURCETYPE:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case BadgeType.PRODUCTBLOCKTAG:
            case BadgeType.PRODUCTBLOCK:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: primaryText,
                };
            case BadgeType.WORKFLOW:
                return {
                    badgeColor: toSecondaryColor(danger),
                    textColor: dangerText,
                };
            case BadgeType.FIXEDINPUT:
                return {
                    badgeColor: toSecondaryColor(warning),
                    textColor: warningText,
                };
            case BadgeType.PRODUCTTAG:
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
