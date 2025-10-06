import { toOptionalObjectProperty } from 'pydantic-forms';

import {
    optionalArrayMapper,
    toOptionalArrayEntries,
    toOptionalArrayEntry,
} from './optionalArray';

describe('toOptionalArrayEntry', () => {
    const testInput = { testField: 'testValue' };

    it('returns an array with the data if the condition is true', () => {
        const result = toOptionalArrayEntry(testInput, true);

        expect(result).toEqual([testInput]);
    });

    it('returns an empty array if the condition is false', () => {
        const result = toOptionalArrayEntry(testInput, false);

        expect(result).toEqual([]);
    });
});

describe('toOptionalArrayEntries', () => {
    test('returns data as an array when condition is true and data is not an array', () => {
        const result = toOptionalArrayEntries('singleItem', true);
        expect(result).toEqual(['singleItem']);
    });

    test('returns data as it is when condition is true and data is already an array', () => {
        const result = toOptionalArrayEntries(['item1', 'item2'], true);
        expect(result).toEqual(['item1', 'item2']);
    });

    test('returns an empty array when condition is false regardless of data type', () => {
        const resultWithSingleItem = toOptionalArrayEntries(
            'singleItem',
            false,
        );
        const resultWithArray = toOptionalArrayEntries(
            ['item1', 'item2'],
            false,
        );

        expect(resultWithSingleItem).toEqual([]);
        expect(resultWithArray).toEqual([]);
    });

    test('does not mutate the original data', () => {
        const singleItem = 'singleItem';
        const arrayData = ['item1', 'item2'];
        toOptionalArrayEntries(singleItem, true);
        toOptionalArrayEntries(arrayData, true);

        expect(singleItem).toBe('singleItem');
        expect(arrayData).toEqual(['item1', 'item2']);
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

describe('toOptionalObjectProperty', () => {
    const flatSchema = { const: 'CONST_VAL' };
    function withSpread(addConstValue: boolean) {
        return {
            ...(addConstValue && { const: flatSchema.const }),
        };
    }
    function withHelper(addConstValue: boolean) {
        return {
            ...toOptionalObjectProperty(
                { const: flatSchema.const },
                addConstValue,
            ),
        };
    }
    it('adds const when addConstValue = true', () => {
        expect(withSpread(true)).toEqual(withHelper(true));
        expect(withSpread(true)).toHaveProperty('const', 'CONST_VAL');
    });
    it('omits const when addConstValue = false', () => {
        expect(withSpread(false)).toEqual(withHelper(false));
        expect(withSpread(false)).not.toHaveProperty('const');
    });
});
