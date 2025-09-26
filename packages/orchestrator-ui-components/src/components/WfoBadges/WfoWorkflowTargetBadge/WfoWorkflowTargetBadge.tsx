import React, { FC } from 'react';

import { useOrchestratorTheme } from '../../../hooks';
import { WorkflowTarget } from '../../../types';
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
            dangerText,
            primaryText,
            success,
            successText,
            warning,
            warningText,
            accent,
            accentText,
        } = theme.colors;

        switch (_target?.toLowerCase()) {
            case WorkflowTarget.CREATE:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case WorkflowTarget.MODIFY:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: primaryText,
                };
            case WorkflowTarget.SYSTEM:
            case WorkflowTarget.VALIDATE:
                return {
                    badgeColor: toSecondaryColor(warning),
                    textColor: warningText,
                };
            case WorkflowTarget.TERMINATE:
                return {
                    badgeColor: toSecondaryColor(danger),
                    textColor: dangerText,
                };
            case WorkflowTarget.RECONCILE:
                return {
                    badgeColor: toSecondaryColor(accent),
                    textColor: accentText,
                };
            default:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: primaryText,
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
