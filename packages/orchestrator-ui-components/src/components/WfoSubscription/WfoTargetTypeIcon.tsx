import React from 'react';

import { EuiAvatar, EuiThemeComputed } from '@elastic/eui';

import { WorkflowTarget } from '@/types';

import { getWorkflowTargetColor, getWorkflowTargetIconContent } from './utils';

interface WfoTargetTypeIconProps {
    target: WorkflowTarget;
    theme: EuiThemeComputed;
    disabled?: boolean;
}

export const WfoTargetTypeIcon = ({
    target,
    theme,
    disabled = false,
}: WfoTargetTypeIconProps) => {
    const color = disabled
        ? theme.colors.lightShade
        : getWorkflowTargetColor(target, theme);
    const name = getWorkflowTargetIconContent(target);
    return <EuiAvatar name={name} size="s" color={color} />;
};
