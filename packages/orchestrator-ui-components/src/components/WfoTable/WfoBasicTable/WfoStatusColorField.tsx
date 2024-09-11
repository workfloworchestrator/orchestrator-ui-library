import React from 'react';

import { tint } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

import { TABLE_ROW_HEIGHT } from '../WfoTable/';

export type WfoStatusColorFieldProps = {
    color: string;
};

const toStatusColorFieldColor = (color: string) => tint(color, 0.3);

export const WfoStatusColorField = ({ color }: WfoStatusColorFieldProps) => {
    const { theme } = useOrchestratorTheme();

    // Todo add styles.ts file
    return (
        <div
            css={{
                backgroundColor: toStatusColorFieldColor(color),
                height: TABLE_ROW_HEIGHT,
                width: theme.size.xs,
            }}
        ></div>
    );
};
