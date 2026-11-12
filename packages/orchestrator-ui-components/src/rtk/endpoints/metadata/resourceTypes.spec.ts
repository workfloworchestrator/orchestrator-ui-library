import { getResourceTypeListSearchQuery } from './resourceTypes';

describe('getResourceTypeListSearchQuery()', () => {
  it('puts the node selection in the query', () => {
    const query = getResourceTypeListSearchQuery(['resourceType'], false);

    expect(query).toContain('query ResourceTypeListSearch(');
    expect(query).toContain('resourceType\n');
    expect(query).not.toContain('description');
  });

  it('always selects the resource type id', () => {
    expect(getResourceTypeListSearchQuery([], false)).toContain('resourceTypeId\n');
  });

  it('selects the sub fields of productBlocks only when it is included', () => {
    expect(getResourceTypeListSearchQuery([], true)).toContain('productBlocks { name }');
    expect(getResourceTypeListSearchQuery([], false)).not.toContain('productBlocks { name }');
  });

  it('does not select productBlocks twice when it has a search path', () => {
    const query = getResourceTypeListSearchQuery(['productBlocks'], true);

    expect(query.match(/productBlocks/g)).toHaveLength(1);
  });
});
