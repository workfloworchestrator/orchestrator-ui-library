import {
    ColumnType,
    WfoTableColumnConfig,
} from '@/components/WfoTable/WfoTable/WfoTable';

import { mapSortableAndFilterableValuesToTableColumnConfig } from './utils';

type TestObject = {
    name: string;
    age: number;
};

const tableColumnConfig: WfoTableColumnConfig<TestObject> = {
    name: {
        columnType: ColumnType.DATA,
        label: 'tesName',
    },
    age: {
        columnType: ColumnType.DATA,
        label: 'testAge',
    },
};

describe('mapSortableAndFilterableValuesToTableColumnConfig', () => {
    it('sets the sortable and filterable properties for the columnConfig object to true when the colum name is specified in the list', () => {
        // Given
        const sortableFieldNames = ['name', 'age', 'nonExistingFieldName'];
        const filterableFieldNames = ['name', 'age', 'nonExistingFieldName'];

        // When
        const result =
            mapSortableAndFilterableValuesToTableColumnConfig<TestObject>(
                tableColumnConfig,
                sortableFieldNames,
                filterableFieldNames,
            );

        // Then
        if (
            result.name?.columnType === ColumnType.DATA &&
            result.age?.columnType === ColumnType.DATA
        ) {
            expect(result.name.isSortable).toEqual(true);
            expect(result.name.isFilterable).toEqual(true);
            expect(result.age.isSortable).toEqual(true);
            expect(result.age.isFilterable).toEqual(true);
        } else {
            // Preventing silently skipping above expects
            throw Error('Some of the fields are not data fields');
        }
    });
    it('sets the sortable and filterable properties for the columnConfig object to false when the colum name is not specified in the list', () => {
        // Given
        const sortableFieldNames = ['nonExistingFieldName'];
        const filterableFieldNames: string[] = [];

        // When
        const result =
            mapSortableAndFilterableValuesToTableColumnConfig<TestObject>(
                tableColumnConfig,
                sortableFieldNames,
                filterableFieldNames,
            );

        // Then
        if (
            result.name?.columnType === ColumnType.DATA &&
            result.age?.columnType === ColumnType.DATA
        ) {
            expect(result.name.isSortable).toEqual(false);
            expect(result.name.isFilterable).toEqual(false);
            expect(result.age.isSortable).toEqual(false);
            expect(result.age.isFilterable).toEqual(false);
        } else {
            // Preventing silently skipping above expects
            throw Error('Some of the fields are not data fields');
        }
    });
});
