import { StepState } from '../../types';
import { getStepContent } from './stepListUtils';

describe('getStepContent()', () => {
    const testStepState: StepState = {
        testProp1: 'testValue1',
        testProp2: 'testValue2',
        label_1: 'testLabel1',
        confirmation_mail: 'testConfirmationMail',
    };

    it('returns the same object as the input if showHiddenKeys is true', () => {
        const result = getStepContent(testStepState, true);

        expect(result).toEqual(testStepState);
    });
    it('returns an object without hidden keys if showHiddenKeys is false', () => {
        const result = getStepContent(testStepState, false);

        expect(Object.keys(result).length).toEqual(2);
        expect(result.testProp1).toEqual('testValue1');
        expect(result.testProp2).toEqual('testValue2');
        expect(result.label_1).toBeUndefined();
        expect(result.confirmation_mail).toBeUndefined();
    });
});
