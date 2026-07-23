import { TableColumnKeys } from '@/components';
import { ColumnType, WfoTableColumnConfig } from '@/components/WfoTable/WfoTable/WfoTable';
import { getTableSettingsColumns } from '@/components/WfoTable/WfoTableSettingsModal/utils';

type TestObject = {
  name: string;
  age: number;
};

const columnConfig: WfoTableColumnConfig<TestObject> = {
  actions: {
    columnType: ColumnType.CONTROL,
    renderControl: () => null,
  },
  name: {
    columnType: ColumnType.DATA,
    label: 'Name',
  },
  age: {
    columnType: ColumnType.DATA,
    label: 'Age',
  },
};

describe('getTableSettingsColumns()', () => {
  it('excludes control columns and keeps only data columns as toggles', () => {
    const result = getTableSettingsColumns(columnConfig, []);
    expect(result.map((column) => column.field)).toEqual(['name', 'age']);
  });

  it('maps each data column label to name and marks all visible when nothing is hidden', () => {
    const result = getTableSettingsColumns(columnConfig, []);
    expect(result).toEqual([
      { field: 'name', name: 'Name', isVisible: true },
      { field: 'age', name: 'Age', isVisible: true },
    ]);
  });

  it('marks a data column as not visible when it is present in hiddenColumns', () => {
    const hiddenColumns: TableColumnKeys<TestObject> = ['age'];
    const result = getTableSettingsColumns(columnConfig, hiddenColumns);
    expect(result.find((column) => column.field === 'age')?.isVisible).toBe(false);
    expect(result.find((column) => column.field === 'name')?.isVisible).toBe(true);
  });
});
