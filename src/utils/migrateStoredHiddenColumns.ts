import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '@/components/WfoTable/utils/constants';

// The structured search table renamed its columns to the search paths of the backend. Hidden columns that users
// saved in the local storage still hold the old keys, which would make the columns visible again.
//
// Only for the tables whose column keys actually changed. The workflow and task lists still use their original
// keys (productName, tag, customer, customerAbbreviation), so they are not migrated.
//
// TEMPORARY, for backwards compatibility only. The saved keys are only rewritten when a user changes their
// table settings, so this does not clean up after itself. Remove it (together with its use in
// useStoredTableConfig) once enough releases have passed that old saved settings are no longer expected.
const COLUMN_RENAMES_BY_STORAGE_KEY: Record<string, Record<string, string>> = {
  [SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY]: {
    productName: 'product.name',
    tag: 'product.tag',
    customerFullname: 'customer.fullname',
    customerShortcode: 'customer.shortcode',
  },
};

export const migrateStoredHiddenColumns = <T>(storageKey: string, hiddenColumns: (keyof T)[]): (keyof T)[] => {
  const renames = COLUMN_RENAMES_BY_STORAGE_KEY[storageKey];
  if (!renames) {
    return hiddenColumns;
  }
  const migrated = hiddenColumns.map((column) => (renames[column as string] ?? column) as keyof T);
  return [...new Set(migrated)];
};
