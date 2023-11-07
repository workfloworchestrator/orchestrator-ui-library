import React from 'react';
import { EuiFlexItem, tint } from '@elastic/eui';
import { useOrchestratorTheme } from '../../../hooks';
import { defaultOrchestratorTheme } from '../../../theme';
import { WFO_STATUS_COLOR_FIELD } from '../utils/columns';

type ThemeType = typeof defaultOrchestratorTheme;

const toStatusColorFieldColor = (color: string) => tint(color, 0.3);

export type WfoStatusColorFieldProps = {
    colorMappings: { [key: string]: string[] };
    state: string;
};

export const STATUS_COLOR_FIELD_COLUMN_PROPS = {
    field: WFO_STATUS_COLOR_FIELD,
    name: '',
    width: '1',
};

export const WfoStatusColorField = ({
    colorMappings,
    state,
}: WfoStatusColorFieldProps) => {
    const { theme } = useOrchestratorTheme();
    let color: keyof ThemeType['colors'] =
        'lightShade' as keyof ThemeType['colors'];

    for (const [colorName, states] of Object.entries(colorMappings)) {
        if (states.includes(state)) {
            color = colorName as keyof ThemeType['colors'];
            break;
        }
    }

    return (
        <EuiFlexItem
            css={{
                paddingInline: theme.base / 4,
                paddingBlock: theme.base + 4,
                backgroundColor: toStatusColorFieldColor(theme.colors[color]),
            }}
        />
    );
};
