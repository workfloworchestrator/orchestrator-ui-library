import { GraphqlFilter } from '@/types';

import { filterDataByCriteria } from './filterData';

describe('filterDataByCriteria', () => {
    const testData = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Doe' },
        { id: 3, name: 'Jane' },
    ];

    it('should filter data by criteria', () => {
        const filterCriteria: GraphqlFilter<(typeof testData)[0]>[] = [
            { field: 'name', value: 'John' },
            { field: 'id', value: '3' },
        ];

        const filteredData = filterDataByCriteria(testData, filterCriteria);

        expect(filteredData).toEqual([{ id: 1, name: 'John' }]);
    });

    it('should return empty array if no match found', () => {
        const filterCriteria: GraphqlFilter<(typeof testData)[0]>[] = [
            { field: 'name', value: 'Nonexistent' },
        ];

        const filteredData = filterDataByCriteria(testData, filterCriteria);

        expect(filteredData).toEqual([]);
    });
});
