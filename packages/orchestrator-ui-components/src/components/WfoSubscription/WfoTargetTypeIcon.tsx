import React, { FC } from 'react';

import { css } from '@emotion/css';

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

interface IconProps {
    targetLetter: string;
    backgroundColor: string;
}
const Icon = ({ targetLetter, backgroundColor }: IconProps) => {
    const { theme } = useOrchestratorTheme();
    const size = theme.size.l;
    return (
        <div
            aria-label={targetLetter}
            role="img"
            title={targetLetter}
            className={css({
                backgroundColor: backgroundColor,
                borderRadius: '50%',
                color: theme.colors.textGhost,
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 500,
                fontSize: theme.size.m,
                display: 'flex',
                height: size,
                width: size,
            })}
        >
            {targetLetter}
        </div>
    );
};

export const WfoTargetTypeIcon: FC<WfoTargetTypeIconProps> = ({
    target,
    disabled = false,
}) => {
    const { theme } = useOrchestratorTheme();
    const backGroundColor = disabled
        ? theme.colors.borderBaseSubdued
        : getWorkflowTargetColor(target, theme);
    const targetLetter = getWorkflowTargetIconContent(target);
    return (
        <Icon targetLetter={targetLetter} backgroundColor={backGroundColor} />
    );
};

export const WfoInSyncCompactIcon: FC<WfoInSyncCompactIconProps> = ({
    disabled,
}) => {
    const { theme } = useOrchestratorTheme();

    const color = disabled
        ? theme.colors.borderBaseSubdued
        : theme.colors.danger;
    const name = 'S';
    return <Icon targetLetter={name} backgroundColor={color} />;
};
