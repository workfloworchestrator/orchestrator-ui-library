import { optionalArrayMapper, toOptionalArrayEntry } from './optionalArray';

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

describe('optionalArrayMapper', () => {
    it('applies the mapper when data is defined', () => {
        const testData = [{ testField: 'testValue' }];

        const result = optionalArrayMapper(testData, () => 'mappedValue');

        expect(result).toEqual(['mappedValue']);
    });
    it('returns an empty array when data is undefined', () => {
        const result = optionalArrayMapper(undefined, () => 'test');

        expect(result).toEqual([]);
    });
});
