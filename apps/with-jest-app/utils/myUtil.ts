// import { ColorModes } from "@orchestrator-ui/orchestrator-ui-components";
import { EuiThemeColorMode } from '@elastic/eui';
import { getNumberValueFromEnvironmentVariable } from '@orchestrator-ui/orchestrator-ui-components';

// import { add, TestComponent } from "npm-template-with-tsup"

export const addNumbers = (a: number, b: number) => {
    return a + b;
};

const testColorMode: EuiThemeColorMode = 'LIGHT';
export const isLightMode = (colorName: string) => {
    return colorName === testColorMode;
};

// export const randomColorMode = () => {
//     return Math.random() > 0.5 ? ColorModes.LIGHT : ColorModes.DARK
// }

export const getMeANumber = (input: string) => {
    return getNumberValueFromEnvironmentVariable(input, 999);
};

// export const  newAddNumbers = (left: number, right: number) => {
//     return add(left, right);
// }
