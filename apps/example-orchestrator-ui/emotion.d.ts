import '@emotion/react';

declare module '@emotion/react' {
    export interface Theme {}
}

// You are also able to use a 3rd party theme this way:
import '@emotion/react';
import { MyTheme } from 'best-custom-react-button';

declare module '@emotion/react' {
    export interface Theme extends MyTheme {}
}
