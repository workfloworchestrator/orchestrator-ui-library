import { TableColumnKeys } from '@/components';
import { ColumnType, WfoTableColumnConfig } from '@/components/WfoTable/WfoTable/WfoTable';
import { SortOrder } from '@/types';

import {
  getSortedVisibleColumns,
  getUpdatedSortOrder,
  mapSortableAndFilterableValuesToTableColumnConfig,
} from './utils';

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

const tableColumnConfigWithControlColumn: WfoTableColumnConfig<TestObject> = {
  actions: {
    columnType: ColumnType.CONTROL,
    renderControl: () => null,
  },
  name: {
    columnType: ColumnType.DATA,
    label: 'testName',
  },
  age: {
    columnType: ColumnType.DATA,
    label: 'testAge',
  },
};

describe('utils', () => {
  describe('getUpdatedSortOrder()', () => {
    it('returns SortOrder.DESC if the currentSortOrder is SortOrder.ASC', () => {
      const currentSortOrder = SortOrder.ASC;
      const result = getUpdatedSortOrder(currentSortOrder);
      expect(result).toBe(SortOrder.DESC);
    });
    it('returns SortOrder.ASC if the currentSortOrder is SortOrder.DESC', () => {
      const currentSortOrder = SortOrder.DESC;
      const result = getUpdatedSortOrder(currentSortOrder);
      expect(result).toBe(SortOrder.ASC);
    });
    it('returns SortOrder.ASC if the currentSortOrder is undefined', () => {
      const currentSortOrder = undefined;
      const result = getUpdatedSortOrder(currentSortOrder);
      expect(result).toBe(SortOrder.ASC);
    });
  });

  describe('getSortedVisibleColumns()', () => {
    it('keeps a control column visible even when its key is present in hiddenColumns', () => {
      // Given a stale hiddenColumns still listing the control column (e.g. from localStorage)
      const hiddenColumns = ['actions'] as unknown as TableColumnKeys<TestObject>;

      // When
      const result = getSortedVisibleColumns(tableColumnConfigWithControlColumn, [], hiddenColumns);

      // Then the control column is still rendered
      const visibleKeys = result.map(([key]) => key);
      expect(visibleKeys).toContain('actions');
    });

    it('hides data columns that are listed in hiddenColumns', () => {
      // Given
      const hiddenColumns: TableColumnKeys<TestObject> = ['age'];

      // When
      const result = getSortedVisibleColumns(tableColumnConfigWithControlColumn, [], hiddenColumns);

      // Then
      const visibleKeys = result.map(([key]) => key);
      expect(visibleKeys).not.toContain('age');
      expect(visibleKeys).toContain('name');
    });

    it('keeps the control column visible while still hiding a hidden data column', () => {
      // Given both a control key and a data key are marked hidden
      const hiddenColumns = ['actions', 'age'] as unknown as TableColumnKeys<TestObject>;

      // When
      const result = getSortedVisibleColumns(tableColumnConfigWithControlColumn, [], hiddenColumns);

      // Then only the data column is hidden; the control column stays visible
      const visibleKeys = result.map(([key]) => key);
      expect(visibleKeys).toContain('actions');
      expect(visibleKeys).toContain('name');
      expect(visibleKeys).not.toContain('age');
    });
  });

  describe('mapSortableAndFilterableValuesToTableColumnConfig()', () => {
    it('sets the sortable and filterable properties for the columnConfig object to true when the colum name is specified in the list', () => {
      // Given
      const sortableFieldNames = ['name', 'age', 'nonExistingFieldName'];
      const filterableFieldNames = ['name', 'age', 'nonExistingFieldName'];

      // When
      const result = mapSortableAndFilterableValuesToTableColumnConfig<TestObject>(
        tableColumnConfig,
        sortableFieldNames,
        filterableFieldNames,
      );

      // Then
      if (result.name?.columnType === ColumnType.DATA && result.age?.columnType === ColumnType.DATA) {
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
      const result = mapSortableAndFilterableValuesToTableColumnConfig<TestObject>(
        tableColumnConfig,
        sortableFieldNames,
        filterableFieldNames,
      );

      // Then
      if (result.name?.columnType === ColumnType.DATA && result.age?.columnType === ColumnType.DATA) {
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
});
