import React from 'react';

import { useOrchestratorTheme } from '@/hooks';
import { WfoCheckmarkCircleFill, WfoMinusCircleFill } from '@/icons';

interface WfoInsyncIconProps {
    inSync: boolean;
}

export const WfoInsyncIcon = ({ inSync }: WfoInsyncIconProps) => {
    const { theme } = useOrchestratorTheme();

    return inSync ? (
        <WfoCheckmarkCircleFill
            height={20}
            width={20}
            color={theme.colors.primary}
        />
    ) : (
        <WfoMinusCircleFill
            height={20}
            width={20}
            color={theme.colors.danger}
        />
    );
};
