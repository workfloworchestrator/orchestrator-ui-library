import { GroupedData } from './WfoGroupedTable';
import { getTotalNumberOfRows, groupData } from './utils';

type TestObject = {
    name: string;
    age: number;
    group: 'group1' | 'group2';
    subGroup: 'subGroup1' | 'subGroup2';
};

describe('WfoGroupedTable - utils', () => {
    describe('groupData()', () => {
        it('is great', () => {
            // Given
            const testData: TestObject[] = [
                {
                    name: 'John',
                    age: 25,
                    group: 'group2',
                    subGroup: 'subGroup1',
                },
                {
                    name: 'Bob',
                    age: 40,
                    group: 'group2',
                    subGroup: 'subGroup2',
                },
                {
                    name: 'Jane',
                    age: 30,
                    group: 'group2',
                    subGroup: 'subGroup2',
                },
                {
                    name: 'Tom',
                    age: 35,
                    group: 'group1',
                    subGroup: 'subGroup1',
                },
            ];

            // When
            const result = groupData(testData, [
                (data) => data.group,
                (data) => data.subGroup,
            ]);

            // Then
            const expected: GroupedData<TestObject> = {
                group1: {
                    subGroup1: [
                        {
                            name: 'Tom',
                            age: 35,
                            group: 'group1',
                            subGroup: 'subGroup1',
                        },
                    ],
                },
                group2: {
                    subGroup1: [
                        {
                            name: 'John',
                            age: 25,
                            group: 'group2',
                            subGroup: 'subGroup1',
                        },
                    ],
                    subGroup2: [
                        {
                            name: 'Bob',
                            age: 40,
                            group: 'group2',
                            subGroup: 'subGroup2',
                        },
                        {
                            name: 'Jane',
                            age: 30,
                            group: 'group2',
                            subGroup: 'subGroup2',
                        },
                    ],
                },
            };
            expect(result).toEqual(expected);
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
                            group: 'group1',
                            subGroup: 'subGroup1',
                        },
                        {
                            name: 'Bob',
                            age: 40,
                            group: 'group1',
                            subGroup: 'subGroup1',
                        },
                    ],
                    subGroup2: [
                        {
                            name: 'Jane',
                            age: 30,
                            group: 'group1',
                            subGroup: 'subGroup2',
                        },
                    ],
                },
                group2: {
                    subGroup1: [
                        {
                            name: 'Tom',
                            age: 35,
                            group: 'group1',
                            subGroup: 'subGroup1',
                        },
                    ],
                },
            };

            const result = getTotalNumberOfRows(testData);

            expect(result).toEqual(4);
        });
    });
});
