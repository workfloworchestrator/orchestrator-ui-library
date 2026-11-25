import type { ResourceTypesResponse } from '@/rtk';
import { ProductLifecycleStatus, SortOrder } from '@/types';
import type { GraphQLPageInfo } from '@/types';

import {
  getResourceTypeExportColumnKeys,
  getResourceTypeExportQueryVariables,
  mapResourceTypesToExportItems,
} from './resourceTypeListExport';

const PAGE_INFO: GraphQLPageInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  totalItems: 1,
  endCursor: null,
  sortFields: [],
  filterFields: [],
};

describe('getResourceTypeExportQueryVariables()', () => {
  it.each([
    [
      'exports the sorted collection on its first page',
      { field: 'description', sortOrder: SortOrder.DESC },
      'network',
      { first: 50, after: 0, sortBy: { field: 'description', order: SortOrder.DESC }, query: 'network' },
    ],
    [
      'does not sort when the table has no sort order',
      { field: 'resourceType', sortOrder: undefined as unknown as SortOrder },
      '',
      { first: 50, after: 0, sortBy: undefined, query: undefined },
    ],
    [
      'sorts on the resource type for the score column, which the query does not have',
      { field: 'score', sortOrder: SortOrder.ASC },
      '',
      { first: 50, after: 0, sortBy: { field: 'resourceType', order: SortOrder.ASC }, query: undefined },
    ],
  ] as const)('%s', (_label, dataSorting, query, expected) => {
    expect(getResourceTypeExportQueryVariables({ ...dataSorting }, 50, query)).toEqual(expected);
  });
});

describe('mapResourceTypesToExportItems()', () => {
  it('exports the product blocks as a concatenated string of ids and names', () => {
    const response: ResourceTypesResponse = {
      resourceTypes: [
        {
          resourceTypeId: 'type-id',
          resourceType: 'Network',
          description: 'A network',
          productBlocks: [
            {
              productBlockId: 'block-id',
              name: 'block',
              tag: 'BLOCK',
              description: 'A block',
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

    expect(mapResourceTypesToExportItems(response)).toEqual([
      {
        resourceTypeId: 'type-id',
        resourceType: 'Network',
        description: 'A network',
        productBlocks: 'block-id: block',
      },
    ]);
  });
});

describe('getResourceTypeExportColumnKeys()', () => {
  it('leaves out the score column, which the collection query does not return', () => {
    expect(getResourceTypeExportColumnKeys({ score: {}, resourceType: {}, description: {} })).toEqual([
      'resourceType',
      'description',
    ]);
  });
});
