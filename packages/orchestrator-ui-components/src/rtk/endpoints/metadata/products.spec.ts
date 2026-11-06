import { getProductListSearchQuery } from './products';

describe('getProductListSearchQuery()', () => {
  it('puts the node selection in the query', () => {
    const query = getProductListSearchQuery(['name', 'tag'], false, false);

    expect(query).toContain('query ProductListSearch(');
    expect(query).toContain('name\n');
    expect(query).toContain('tag');
    expect(query).not.toContain('createdAt');
  });

  it('always selects the product id', () => {
    expect(getProductListSearchQuery([], false, false)).toContain('productId\n');
  });

  it.each([
    ['productBlocks', 'productBlocks { name }', true, false],
    ['fixedInputs', 'fixedInputs { name value }', false, true],
  ])(
    'selects the sub fields of %s when it is included',
    (_field, selection, includeProductBlocks, includeFixedInputs) => {
      expect(getProductListSearchQuery([], includeProductBlocks, includeFixedInputs)).toContain(selection);
      expect(getProductListSearchQuery([], false, false)).not.toContain(selection);
    },
  );

  it('does not select a nested list twice when it has a search path', () => {
    const query = getProductListSearchQuery(['productBlocks'], true, false);

    expect(query.match(/productBlocks/g)).toHaveLength(1);
  });
});
