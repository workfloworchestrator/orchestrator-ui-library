import React from 'react';
import { EuiFlexItem, tint } from '@elastic/eui';

export type WfoStatusColorFieldProps = {
    color: string;
};

const toStatusColorFieldColor = (color: string) => tint(color, 0.3);

export const WfoStatusColorField = ({ color }: WfoStatusColorFieldProps) => {
    return (
        <EuiFlexItem
            css={{
                backgroundColor: toStatusColorFieldColor(color),
                height: '100%',
                width: '100%',
            }}
        ></EuiFlexItem>
    );
};
