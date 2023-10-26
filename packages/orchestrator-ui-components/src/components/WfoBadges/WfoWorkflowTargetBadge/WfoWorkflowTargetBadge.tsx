import { WfoBadge } from '../WfoBadge';
import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../../hooks';
import { WorkflowTarget } from '../../../types';

export type WfoWorkflowTargetBadgeProps = {
    target: WorkflowTarget;
};

export const WfoWorkflowTargetBadge: FC<WfoWorkflowTargetBadgeProps> = ({
    target,
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromTarget = (target: string) => {
        const {
            primary,
            danger,
            dangerText,
            primaryText,
            success,
            successText,
            warning,
            warningText,
        } = theme.colors;

        switch (target.toLowerCase()) {
            case WorkflowTarget.CREATE:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case WorkflowTarget.MODIFY:
            case WorkflowTarget.UPGRADE:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: primaryText,
                };
            case WorkflowTarget.SYSTEM:
                return {
                    badgeColor: toSecondaryColor(warning),
                    textColor: warningText,
                };
            case WorkflowTarget.TERMINATE:
                return {
                    badgeColor: toSecondaryColor(danger),
                    textColor: dangerText,
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
            {target.toLowerCase()}
        </WfoBadge>
    );
};
