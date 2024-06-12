// import {addNumbers, randomColorMode} from "./myUtil";
import { EuiThemeColorMode } from '@elastic/eui';

// import { ColorModes } from '@orchestrator-ui/orchestrator-ui-components'
// import {newAddNumbers} from "./myUtil";
import { addNumbers, getMeANumber, isLightMode } from './myUtil';

describe('myUtil', () => {
    it('returns the sum', () => {
        const result = addNumbers(1, 2);

        expect(result).toEqual(3);
    });

    // orchestrator-ui-components: enum
    // it('returns a color mode', () => {
    //     const result = randomColorMode();
    //
    //     expect(result).toEqual(ColorModes.DARK);
    // })

    // EuiThemeColorMode: type and util
    it('returns true', () => {
        const input: EuiThemeColorMode = 'LIGHT';

        const result = isLightMode(input);
        expect(result).toEqual(true);
    });

    it('getMeNumber', () => {
        const result = getMeANumber('1');
        expect(result).toEqual(1);
    });

    // it('newAddNumbers', () => {
    //     const result = newAddNumbers(1, 2);
    //     expect(result).toEqual(3);
    // })
});
