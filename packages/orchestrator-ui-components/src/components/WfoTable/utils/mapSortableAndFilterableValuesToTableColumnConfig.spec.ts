import { WfoTableColumns } from './columns';
import { mapSortableAndFilterableValuesToTableColumnConfig } from './mapSortableAndFilterableValuesToTableColumnConfig';

type TestObject = {
    name: string;
    age: number;
};

const tableColumnConfig: WfoTableColumns<TestObject> = {
    name: {
        field: 'name',
        name: 'tesName',
    },
    age: {
        field: 'age',
        name: 'testAge',
    },
};

describe('mapSortableAndFilterableValuesToTableColumnConfig', () => {
    it('sets the sortable and filterable properties for the columnConfig object to true when the colum name is specified in the list', () => {
        const sortableFieldNames = ['name', 'age', 'nonExistingFieldName'];
        const filterableFieldNames = ['name', 'age', 'nonExistingFieldName'];

        const result = mapSortableAndFilterableValuesToTableColumnConfig(
            tableColumnConfig,
            sortableFieldNames,
            filterableFieldNames,
        );

        expect(result.name.sortable).toEqual(true);
        expect(result.name.filterable).toEqual(true);
        expect(result.age.sortable).toEqual(true);
        expect(result.age.filterable).toEqual(true);
    });

    it('sets the sortable and filterable properties for the columnConfig object to false when the colum name is not specified in the list', () => {
        const sortableFieldNames = ['nonExistingFieldName'];
        const filterableFieldNames: string[] = [];

        const result = mapSortableAndFilterableValuesToTableColumnConfig(
            tableColumnConfig,
            sortableFieldNames,
            filterableFieldNames,
        );

        expect(result.name.sortable).toEqual(false);
        expect(result.name.filterable).toEqual(false);
        expect(result.age.sortable).toEqual(false);
        expect(result.age.filterable).toEqual(false);
    });
});
