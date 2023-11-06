import React from 'react';
import { EuiFlexItem } from '@elastic/eui';
import { useOrchestratorTheme } from '../../../hooks';
import { defaultOrchestratorTheme } from '../../../theme';
import { WFO_STATUS_COLOR_FIELD } from '../utils/columns';

export type WfoStatusColorFieldProps = {
    colorMappings: { [key: string]: string[] };
    state: string;
};

/*
    Can we have all the definitions (ServiceTicketDefinition, ProductBlockDefinition ...)
    extend from a base type? (ex. Definition)
*/
export const STATUS_COLOR_FIELD_COLUMN_PROPS = {
    field: WFO_STATUS_COLOR_FIELD,
    name: '',
    width: '1',
};

type ThemeType = typeof defaultOrchestratorTheme;

export const WfoStatusColorField = ({
    colorMappings,
    state,
}: WfoStatusColorFieldProps) => {
    const { theme, toStatusColorFieldColor } = useOrchestratorTheme();
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
            style={{
                paddingInline: theme.base / 4,
                paddingBlock: theme.base + 8,
                backgroundColor: toStatusColorFieldColor(theme.colors[color]),
            }}
        />
    );
};
