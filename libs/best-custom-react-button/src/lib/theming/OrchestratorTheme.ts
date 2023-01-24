import { DataType } from 'csstype';

export interface MyTheme {
    colors: {
        primary: DataType.Color;
        secondary: DataType.Color;
    };
}

export const defaultTheme: MyTheme = {
    colors: {
        primary: 'red',
        secondary: 'blue',
    },
};
