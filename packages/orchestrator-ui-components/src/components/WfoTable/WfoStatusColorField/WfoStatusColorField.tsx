import React from 'react';

import { getWfoStatusColorFieldStyles } from '@/components/WfoTable/WfoStatusColorField/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export type WfoStatusColorFieldProps = {
    color: string;
};

export const WfoStatusColorField = ({ color }: WfoStatusColorFieldProps) => {
    const { getStatusColorFieldStyle } = useWithOrchestratorTheme(
        getWfoStatusColorFieldStyles,
    );

    return <div css={getStatusColorFieldStyle(color)}></div>;
};
