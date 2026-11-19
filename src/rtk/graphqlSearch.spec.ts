import { getCursorPaginationCacheOptions } from './graphqlSearch';

describe('getCursorPaginationCacheOptions() merge', () => {
  type Node = { id: string; note: string };
  const { merge } = getCursorPaginationCacheOptions<Node>(({ id }) => id);
  const response = (nodes: Node[], nextPageCursor: string | null) => ({
    searchEdges: nodes.map((node) => ({ score: 1, matchingFields: [], node })),
    pageInfo: { totalItems: 3, hasNextPage: nextPageCursor !== null },
    nextPageCursor,
  });

  it('replaces the cache when there is no cursor', () => {
    const cache = response([{ id: 'a', note: '' }], 'c1');
    merge(cache, response([{ id: 'b', note: '' }], null), { arg: {} });
    expect(cache.searchEdges.map(({ node }) => node.id)).toEqual(['b']);
    expect(cache.nextPageCursor).toBeNull();
  });

  it('appends new rows when there is a cursor', () => {
    const cache = response([{ id: 'a', note: '' }], 'c1');
    merge(cache, response([{ id: 'b', note: '' }], null), { arg: { cursor: 'c1' } });
    expect(cache.searchEdges.map(({ node }) => node.id)).toEqual(['a', 'b']);
    expect(cache.nextPageCursor).toBeNull();
  });

  it('replaces rows that are already cached instead of duplicating them', () => {
    const cache = response(
      [
        { id: 'a', note: '' },
        { id: 'b', note: 'old' },
      ],
      'c2',
    );
    merge(cache, response([{ id: 'b', note: 'new' }], 'c3'), { arg: { cursor: 'c2' } });
    expect(cache.searchEdges.map(({ node }) => node)).toEqual([
      { id: 'a', note: '' },
      { id: 'b', note: 'new' },
    ]);
    expect(cache.nextPageCursor).toBe('c3');
  });
});
