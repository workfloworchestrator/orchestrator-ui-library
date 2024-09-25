import { GroupedData } from './WfoGroupedTable';
import {
    getTotalNumberOfRows,
    groupData,
    toObjectWithSortedProperties,
} from './utils';

type TestObject = {
    name: string;
    age: number;
    group: 'groupA' | 'groupB';
    subGroup: 'subGroupA' | 'subGroupB';
};

describe('WfoGroupedTable - utils', () => {
    describe('groupData()', () => {
        it('successfully groups the data. Sorting alphabetically by group name', () => {
            // Given
            const testData: TestObject[] = [
                {
                    name: 'John',
                    age: 25,
                    group: 'groupB',
                    subGroup: 'subGroupA',
                },
                {
                    name: 'Bob',
                    age: 40,
                    group: 'groupB',
                    subGroup: 'subGroupB',
                },
                {
                    name: 'Jane',
                    age: 30,
                    group: 'groupB',
                    subGroup: 'subGroupB',
                },
                {
                    name: 'Tom',
                    age: 35,
                    group: 'groupA',
                    subGroup: 'subGroupA',
                },
            ];

            // When
            const result = groupData(testData, [
                (data) => data.group,
                (data) => data.subGroup,
            ]);

            // Then
            const expected: GroupedData<TestObject> = {
                groupA: {
                    subGroupA: [
                        {
                            name: 'Tom',
                            age: 35,
                            group: 'groupA',
                            subGroup: 'subGroupA',
                        },
                    ],
                },
                groupB: {
                    subGroupA: [
                        {
                            name: 'John',
                            age: 25,
                            group: 'groupB',
                            subGroup: 'subGroupA',
                        },
                    ],
                    subGroupB: [
                        {
                            name: 'Bob',
                            age: 40,
                            group: 'groupB',
                            subGroup: 'subGroupB',
                        },
                        {
                            name: 'Jane',
                            age: 30,
                            group: 'groupB',
                            subGroup: 'subGroupB',
                        },
                    ],
                },
            };
            expect(result).toEqual(expected);
        });
    });

    describe('sort object by properties', () => {
        // Given
        const testObject = {
            c: 'c',
            a: 'a',
            b: 'b',
        };

        // When
        const sortedObject = toObjectWithSortedProperties(testObject);

        // Then
        it('sorts the object by properties', () => {
            expect(sortedObject).toEqual({
                a: 'a',
                b: 'b',
                c: 'c',
            });
        });
    });

    describe('getTotalNumberOfRows()', () => {
        it('counts the total number of data rows', () => {
            const testData: GroupedData<TestObject> = {
                group1: {
                    subGroup1: [
                        {
                            name: 'John',
                            age: 25,
                            group: 'groupA',
                            subGroup: 'subGroupA',
                        },
                        {
                            name: 'Bob',
                            age: 40,
                            group: 'groupA',
                            subGroup: 'subGroupA',
                        },
                    ],
                    subGroup2: [
                        {
                            name: 'Jane',
                            age: 30,
                            group: 'groupA',
                            subGroup: 'subGroupB',
                        },
                    ],
                },
                group2: {
                    subGroup1: [
                        {
                            name: 'Tom',
                            age: 35,
                            group: 'groupA',
                            subGroup: 'subGroupA',
                        },
                    ],
                },
            };

            const result = getTotalNumberOfRows(testData);

            expect(result).toEqual(4);
        });
    });
});
