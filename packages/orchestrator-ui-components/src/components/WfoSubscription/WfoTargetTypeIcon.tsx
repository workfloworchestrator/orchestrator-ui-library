import React from 'react';

import { EuiAvatar } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WorkflowTarget } from '@/types';

import { getWorkflowTargetColor, getWorkflowTargetIconContent } from './utils';

interface WfoTargetTypeIconProps {
    target: WorkflowTarget;
    disabled?: boolean;
}

export const WfoTargetTypeIcon = ({
    target,
    disabled = false,
}: WfoTargetTypeIconProps) => {
    const { theme } = useOrchestratorTheme();

    const color = disabled
        ? theme.colors.lightShade
        : getWorkflowTargetColor(target, theme);
    const name = getWorkflowTargetIconContent(target);
    return <EuiAvatar name={name} size="s" color={color} />;
};
