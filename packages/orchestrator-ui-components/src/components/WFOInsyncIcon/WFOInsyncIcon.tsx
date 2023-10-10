import React from 'react';
import { WFOCheckmarkCircleFill, WFOMinusCircleOutline } from '../../icons';
import { useOrchestratorTheme } from '../../hooks';

interface WFOInsyncIconProps {
    inSync: boolean;
}

export const WFOInsyncIcon = ({ inSync }: WFOInsyncIconProps) => {
    const { theme } = useOrchestratorTheme();

    return inSync ? (
        <WFOCheckmarkCircleFill
            height={20}
            width={20}
            color={theme.colors.primary}
        />
    ) : (
        <WFOMinusCircleOutline
            height={20}
            width={20}
            color={theme.colors.mediumShade}
        />
    );
};
