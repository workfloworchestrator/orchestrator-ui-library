import React, { FC } from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { WorkflowTarget } from '@/types';

import { WfoBadge } from '../WfoBadge';

export type WfoWorkflowTargetBadgeProps = {
    target: WorkflowTarget;
};

export const WfoWorkflowTargetBadge: FC<WfoWorkflowTargetBadgeProps> = ({
    target,
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();
    if (!target) return null;

    const getBadgeColorFromTarget = (_target: string) => {
        const {
            primary,
            danger,
            textDanger,
            textPrimary,
            success,
            textSuccess,
            warning,
            textWarning,
            accent,
            textAccent,
        } = theme.colors;

        switch (_target?.toLowerCase()) {
            case WorkflowTarget.CREATE:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: textSuccess,
                };
            case WorkflowTarget.MODIFY:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: textPrimary,
                };
            case WorkflowTarget.SYSTEM:
            case WorkflowTarget.VALIDATE:
                return {
                    badgeColor: toSecondaryColor(warning),
                    textColor: textWarning,
                };
            case WorkflowTarget.TERMINATE:
                return {
                    badgeColor: toSecondaryColor(danger),
                    textColor: textDanger,
                };
            case WorkflowTarget.RECONCILE:
                return {
                    badgeColor: toSecondaryColor(accent),
                    textColor: textAccent,
                };
            default:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: textPrimary,
                };
        }
    };

    const { badgeColor, textColor } = getBadgeColorFromTarget(target);

    return (
        <WfoBadge textColor={textColor} color={badgeColor}>
            {target?.toLowerCase()}
        </WfoBadge>
    );
};
