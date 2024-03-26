import {
    getConcatenatedPagedResult,
    getConcatenatedResult,
} from './resultFlattener';

describe('pagedResultFlattener', () => {
    it('returns an empty string when the paged result is empty', () => {
        const pagedResult = { page: [] };
        const fields = ['name', 'age'];

        const result = getConcatenatedPagedResult(pagedResult, fields);

        expect(result).toBe('');
    });
});

describe('resultFlattener', () => {
    it('returns a flattened string of the specified fields', () => {
        type TestItem = {
            name: string;
            age: number;
        };
        const results = [
            { name: 'John', age: 25 },
            { name: 'Jane', age: 30 },
            { name: 'Bob', age: 40 },
        ];
        const fields: Array<keyof TestItem> = ['name', 'age'];
        const result = getConcatenatedResult<TestItem>(results, fields);
        expect(result).toBe('John: 25 - Jane: 30 - Bob: 40');
    });

    it('returns a flattened string with selected fields only', () => {
        type TestItem = {
            name: string;
            age: number;
            city: string;
        };
        const results: TestItem[] = [
            { name: 'John', age: 25, city: 'New York' },
            { name: 'Jane', age: 30, city: 'London' },
            { name: 'Bob', age: 40, city: 'Paris' },
        ];

        const fields: Array<keyof TestItem> = ['name', 'city'];

        const result = getConcatenatedResult(results, fields);

        expect(result).toBe('John: New York - Jane: London - Bob: Paris');
    });
});
