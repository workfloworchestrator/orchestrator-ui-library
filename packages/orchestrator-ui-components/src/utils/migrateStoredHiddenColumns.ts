import {
  ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
  ACTIVE_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY,
  COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
  COMPLETED_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY,
  SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
} from '@/components/WfoTable/utils/constants';

// The structured search tables renamed their columns to the search paths of the backend. Hidden columns that
// users saved in the local storage still hold the old keys, which would make the columns visible again.
//
// TEMPORARY, for backwards compatibility only. The saved keys are only rewritten when a user changes their
// table settings, so this does not clean up after itself. Remove it (together with its use in
// useStoredTableConfig) once enough releases have passed that old saved settings are no longer expected.
const SUBSCRIPTION_COLUMN_RENAMES: Record<string, string> = {
  productName: 'product.name',
  tag: 'product.tag',
  customerFullname: 'customer.fullname',
  customerShortcode: 'customer.shortcode',
};

const PROCESS_COLUMN_RENAMES: Record<string, string> = {
  productName: 'product.name',
  tag: 'product.tag',
  customer: 'customer.fullname',
  customerAbbreviation: 'customer.shortcode',
};

const COLUMN_RENAMES_BY_STORAGE_KEY: Record<string, Record<string, string>> = {
  [SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY]: SUBSCRIPTION_COLUMN_RENAMES,
  [ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY]: PROCESS_COLUMN_RENAMES,
  [COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY]: PROCESS_COLUMN_RENAMES,
  [ACTIVE_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY]: PROCESS_COLUMN_RENAMES,
  [COMPLETED_TASKS_LIST_TABLE_LOCAL_STORAGE_KEY]: PROCESS_COLUMN_RENAMES,
};

export const migrateStoredHiddenColumns = <T>(storageKey: string, hiddenColumns: (keyof T)[]): (keyof T)[] => {
  const renames = COLUMN_RENAMES_BY_STORAGE_KEY[storageKey];
  if (!renames) {
    return hiddenColumns;
  }
  const migrated = hiddenColumns.map((column) => (renames[column as string] ?? column) as keyof T);
  return [...new Set(migrated)];
};
