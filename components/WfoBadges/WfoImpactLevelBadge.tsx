import React, { FC } from 'react';

import { TextSize } from '@elastic/eui/src/components/text/text';
import {
    WfoBadge,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { ImpactLevel } from '@/types';

export type WfoProcessStatusBadgeProps = {
    impactedObjectImpact: ImpactLevel;
    size?: TextSize;
};

export const WfoImpactLevelBadge: FC<WfoProcessStatusBadgeProps> = ({
    impactedObjectImpact,
    size,
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromImpactLevel = () => {
        const {
            lightShade,
            success,
            successText,
            text,
            warning,
            warningText,
            danger,
            dangerText,
        } = theme.colors;

        const { NO_IMPACT, REDUCED_REDUNDANCY, RESILIENCE_LOSS, DOWN } =
            ImpactLevel;

        switch (impactedObjectImpact) {
            case NO_IMPACT:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case REDUCED_REDUNDANCY:
            case RESILIENCE_LOSS:
                return {
                    badgeColor: toSecondaryColor(warning),
                    textColor: warningText,
                };
            case DOWN:
                return {
                    badgeColor: toSecondaryColor(danger),
                    textColor: dangerText,
                };
            default:
                return {
                    badgeColor: toSecondaryColor(lightShade),
                    textColor: text,
                };
        }
    };

    const { badgeColor, textColor } = getBadgeColorFromImpactLevel();

    return (
        <WfoBadge textColor={textColor} color={badgeColor} size={size ?? 'xs'}>
            {impactedObjectImpact.toLowerCase()}
        </WfoBadge>
    );
};
