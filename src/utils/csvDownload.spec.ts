import { PaginatedSearchResults } from '@/types';

import { getSearchExportTruncation } from './csvDownload';

const getExportResult = (hasNextPage: boolean, totalItems?: number): PaginatedSearchResults => ({
  data: [],
  cursor: totalItems === undefined ? null : { total_items: totalItems, start_cursor: 0, end_cursor: 999 },
  page_info: { has_next_page: hasNextPage, next_page_cursor: null },
  search_metadata: { search_type: null, description: null },
});

describe('getSearchExportTruncation()', () => {
  it('returns undefined when all results were exported', () => {
    expect(getSearchExportTruncation(getExportResult(false, 250), 250)).toBeUndefined();
  });

  it('returns the total and exported counts when the export was cut off', () => {
    expect(getSearchExportTruncation(getExportResult(true, 4321), 1000)).toEqual({
      totalResults: 4321,
      maximumExportedResults: 1000,
    });
  });

  it('falls back to the exported count when the total is unknown', () => {
    expect(getSearchExportTruncation(getExportResult(true), 1000)).toEqual({
      totalResults: 1000,
      maximumExportedResults: 1000,
    });
  });
});
