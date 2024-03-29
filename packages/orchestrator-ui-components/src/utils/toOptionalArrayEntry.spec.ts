import { toOptionalArrayEntry } from './toOptionalArrayEntry';

describe('toOptionalArrayEntry', () => {
    const testInput = { testField: 'testValue' };

    it('returns an array with the data if ', () => {
        const result = toOptionalArrayEntry(testInput, true);

        expect(result).toEqual([testInput]);
    });

    it('returns an empty array if the condition is false', () => {
        const result = toOptionalArrayEntry(testInput, false);

        expect(result).toEqual([]);
    });
});
