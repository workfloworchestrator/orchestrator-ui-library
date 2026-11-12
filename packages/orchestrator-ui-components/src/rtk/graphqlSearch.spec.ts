import { getSearchVariables } from './graphqlSearch';

describe('getSearchVariables()', () => {
  it('starts at the offset of a structured search', () => {
    expect(getSearchVariables({ query: '', columns: [], limit: 20, offset: 40 })).toMatchObject({
      first: 20,
      after: 40,
    });
  });

  it('starts at 0 and passes the cursor of a text query', () => {
    expect(getSearchVariables({ query: 'abc', columns: [], limit: 20, cursor: 'next' })).toMatchObject({
      after: 0,
      search: { query: 'abc', cursor: 'next' },
    });
  });
});
