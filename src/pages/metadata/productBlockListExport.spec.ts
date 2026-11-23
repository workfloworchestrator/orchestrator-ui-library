import type { ProductBlocksResponse } from '@/rtk';
import { ProductLifecycleStatus, SortOrder } from '@/types';
import type { GraphQLPageInfo } from '@/types';

import {
  getProductBlockExportColumnKeys,
  getProductBlockExportQueryVariables,
  mapProductBlockDefinitionsToExportItems,
} from './productBlockListExport';

const PAGE_INFO: GraphQLPageInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  totalItems: 1,
  endCursor: null,
  sortFields: [],
  filterFields: [],
};

describe('getProductBlockExportQueryVariables()', () => {
  it('exports the sorted collection on its first page', () => {
    const variables = getProductBlockExportQueryVariables({ field: 'tag', sortOrder: SortOrder.DESC }, 50, 'block');

    expect(variables).toEqual({
      first: 50,
      after: 0,
      sortBy: { field: 'tag', order: SortOrder.DESC },
      query: 'block',
    });
  });

  it('does not sort when the table has no sort order', () => {
    expect(
      getProductBlockExportQueryVariables({ field: 'name', sortOrder: undefined as unknown as SortOrder }, 50, ''),
    ).toEqual({
      first: 50,
      after: 0,
      sortBy: undefined,
      query: undefined,
    });
  });

  it('sorts on the name for the score column, which the query does not have', () => {
    const variables = getProductBlockExportQueryVariables({ field: 'score', sortOrder: SortOrder.ASC }, 50, '');

    expect(variables.sortBy).toEqual({ field: 'name', order: SortOrder.ASC });
  });
});

describe('mapProductBlockDefinitionsToExportItems()', () => {
  it('exports the nested lists as concatenated strings, with the resource type descriptions', () => {
    const response: ProductBlocksResponse = {
      productBlocks: [
        {
          productBlockId: 'block-id',
          name: 'block',
          tag: 'BLOCK',
          description: 'A block',
          status: ProductLifecycleStatus.ACTIVE,
          createdAt: '2026-01-01T00:00:00.000Z',
          endDate: null,
          resourceTypes: [
            {
              resourceTypeId: 'type-id',
              resourceType: 'Network',
              description: 'A network',
              productBlocks: [],
            },
          ],
          dependsOn: [
            {
              productBlockId: 'other-id',
              name: 'other',
              tag: 'OTHER',
              description: 'Another block',
              status: ProductLifecycleStatus.ACTIVE,
              createdAt: '2026-01-01T00:00:00.000Z',
              endDate: null,
              resourceTypes: [],
              dependsOn: [],
            },
          ],
        },
      ],
      pageInfo: PAGE_INFO,
    };

    expect(mapProductBlockDefinitionsToExportItems(response)).toEqual([
      {
        productBlockId: 'block-id',
        name: 'block',
        tag: 'BLOCK',
        description: 'A block',
        status: ProductLifecycleStatus.ACTIVE,
        resourceTypes: 'Network: A network',
        dependsOn: 'other',
        createdAt: '2026-01-01T00:00:00.000Z',
        endDate: null,
      },
    ]);
  });
});

describe('getProductBlockExportColumnKeys()', () => {
  it('leaves out the score column, which the collection query does not return', () => {
    expect(getProductBlockExportColumnKeys({ score: {}, name: {}, createdAt: {} })).toEqual(['name', 'createdAt']);
  });
});
