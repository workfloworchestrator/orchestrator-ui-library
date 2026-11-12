import { getWorkflowListSearchQuery } from './workflows';

describe('getWorkflowListSearchQuery()', () => {
  it('puts the requested fields in the node selection of the search', () => {
    const query = getWorkflowListSearchQuery(['name', 'target'], false);

    expect(query).toContain('query MetadataWorkflowListSearch(');
    expect(query).toContain('search: $search');
    expect(query).toContain('workflowId\n');
    expect(query).not.toContain('createdAt');
  });

  it.each([
    ['selects', true, true],
    ['leaves out', false, false],
  ])('%s the products when includeProducts is %s', (_description, includeProducts, isSelected) => {
    expect(getWorkflowListSearchQuery([], includeProducts).includes('products { tag }')).toBe(isSelected);
  });
});
