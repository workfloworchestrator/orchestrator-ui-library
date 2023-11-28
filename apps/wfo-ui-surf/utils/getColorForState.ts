import { ServiceTicketProcessState } from '../types';

const DEFAULT_COLOR = 'lightShade';

export type ColorMappings = {
    [key: string]: string[];
};

export const getColorForState = (
    colorMappings: ColorMappings,
    state: string,
): string => {
    for (const [colorName, states] of Object.entries(colorMappings)) {
        if (states.includes(state)) {
            return colorName;
        }
    }
    return DEFAULT_COLOR;
};
