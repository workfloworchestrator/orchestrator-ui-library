import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '@/components/WfoTable/utils/constants';

import { migrateStoredHiddenColumns } from './migrateStoredHiddenColumns';

describe('migrateStoredHiddenColumns()', () => {
  it.each([
    {
      name: 'all renamed subscription keys',
      stored: ['productName', 'tag', 'customerFullname', 'customerShortcode'],
      expected: ['product.name', 'product.tag', 'customer.fullname', 'customer.shortcode'],
    },
    {
      name: 'keys that are already migrated, without duplicating them',
      stored: ['productName', 'product.name', 'customerFullname', 'metadata'],
      expected: ['product.name', 'customer.fullname', 'metadata'],
    },
    {
      name: 'keys that were not renamed',
      stored: ['metadata', 'note'],
      expected: ['metadata', 'note'],
    },
  ])('translates the saved keys of $name', ({ stored, expected }) => {
    expect(migrateStoredHiddenColumns<Record<string, unknown>>(SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY, stored)).toEqual(
      expected,
    );
  });
});
