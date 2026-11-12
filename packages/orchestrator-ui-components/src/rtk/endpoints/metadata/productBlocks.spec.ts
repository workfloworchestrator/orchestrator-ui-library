import { getProductBlockListSearchQuery } from './productBlocks';

describe('getProductBlockListSearchQuery()', () => {
  it('puts the node selection in the query', () => {
    const query = getProductBlockListSearchQuery(['name', 'tag'], false, false);

    expect(query).toContain('query ProductBlockListSearch(');
    expect(query).toContain('name\n');
    expect(query).toContain('tag');
    expect(query).not.toContain('createdAt');
  });

  it('always selects the product block id', () => {
    expect(getProductBlockListSearchQuery([], false, false)).toContain('productBlockId\n');
  });

  it.each([
    ['resourceTypes', 'resourceTypes { resourceType description resourceTypeId }', true, false],
    ['dependsOn', 'dependsOn { name }', false, true],
  ])(
    'selects the sub fields of %s when it is included',
    (_field, selection, includeResourceTypes, includeDependsOn) => {
      expect(getProductBlockListSearchQuery([], includeResourceTypes, includeDependsOn)).toContain(selection);
      expect(getProductBlockListSearchQuery([], false, false)).not.toContain(selection);
    },
  );

  it('does not select a nested list twice when it has a search path', () => {
    const query = getProductBlockListSearchQuery(['resourceTypes'], true, false);

    expect(query.match(/resourceTypes/g)).toHaveLength(1);
  });
});
