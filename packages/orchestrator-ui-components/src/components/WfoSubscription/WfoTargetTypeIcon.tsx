import React, { FC } from 'react';

import { EuiAvatar } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WorkflowTarget } from '@/types';

import { getWorkflowTargetColor, getWorkflowTargetIconContent } from './utils';

interface WfoTargetTypeIconProps {
    target: WorkflowTarget;
    disabled?: boolean;
}

interface WfoInSyncCompactIconProps {
    disabled?: boolean;
    isLoading?: boolean;
}

export const WfoTargetTypeIcon: FC<WfoTargetTypeIconProps> = ({
    target,
    disabled = false,
}) => {
    const { theme } = useOrchestratorTheme();

    const color = disabled
        ? theme.colors.lightShade
        : getWorkflowTargetColor(target, theme);
    const name = getWorkflowTargetIconContent(target);
    return <EuiAvatar name={name} size="s" color={color} />;
};

export const WfoInSyncCompactIcon: FC<WfoInSyncCompactIconProps> = ({
    disabled,
}) => {
    const { theme } = useOrchestratorTheme();

    const color = disabled ? theme.colors.lightShade : theme.colors.danger;
    const name = 'S';
    return <EuiAvatar name={name} size="s" color={color} />;
};
