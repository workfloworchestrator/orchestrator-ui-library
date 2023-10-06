import { getStepContent } from './stepListUtils';
import { StepState } from '../../types';

describe('getStepContent()', () => {
    it('returns the same object as the input if showHiddenKeys is false', () => {
        const stepState: StepState = {
            testProp1: 'testValue1',
            testProp2: 'testValue2',
            label_1: 'testLabel1',
            confirmation_mail: 'testConfirmationMail',
        };
        const result = getStepContent(stepState, false);

        expect(result).toEqual(stepState);
    });
    it('returns an object without hidden keys if showHiddenKeys is true', () => {
        const stepState: StepState = {
            testProp1: 'testValue1',
            testProp2: 'testValue2',
            label_1: 'testLabel1',
            confirmation_mail: 'testConfirmationMail',
        };
        const result = getStepContent(stepState, true);

        expect(Object.keys(result).length).toEqual(2);
        expect(result.testProp1).toEqual('testValue1');
        expect(result.testProp2).toEqual('testValue2');
        expect(result.label_1).toBeUndefined();
        expect(result.confirmation_mail).toBeUndefined();
    });
});
