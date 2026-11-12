import {
  METADATA_TASKS_TABLE_LOCAL_STORAGE_KEY,
  SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
} from '@/components/WfoTable/utils/constants';

import { migrateStoredHiddenColumns } from './migrateStoredHiddenColumns';

describe('migrateStoredHiddenColumns()', () => {
  it.each([
    {
      name: 'subscriptions, without duplicating keys that are already migrated',
      key: SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
      stored: ['productName', 'product.name', 'customerFullname', 'metadata'],
      expected: ['product.name', 'customer.fullname', 'metadata'],
    },
    {
      name: 'nothing for tables that were not renamed',
      key: METADATA_TASKS_TABLE_LOCAL_STORAGE_KEY,
      stored: ['productName', 'customer'],
      expected: ['productName', 'customer'],
    },
  ])('translates the saved keys of $name', ({ key, stored, expected }) => {
    expect(migrateStoredHiddenColumns<Record<string, unknown>>(key, stored)).toEqual(expected);
  });
});
