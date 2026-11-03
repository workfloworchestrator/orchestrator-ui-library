import { getProcessListSearchQuery } from './processList';

describe('getProcessListSearchQuery()', () => {
  it('puts the node selection in the query', () => {
    const query = getProcessListSearchQuery(['product.name'], false);

    expect(query).toContain('query ProcessListSearch(');
    expect(query).toContain('product { name }');
    expect(query).not.toContain('lastModifiedAt');
  });

  it('always selects the fields the row and its actions need', () => {
    const query = getProcessListSearchQuery([], false);

    expect(query).toContain('processId\n');
    expect(query).toContain('isTask\n');
    expect(query).toContain('userPermissions { retryAllowed resumeAllowed }');
  });

  it('nests the selection of the customer fields', () => {
    const query = getProcessListSearchQuery(['customer.fullname', 'customer.shortcode'], false);

    expect(query).toContain('customer { fullname }');
    expect(query).toContain('customer { shortcode }');
  });

  it.each([
    ['selects', true, true],
    ['leaves out', false, false],
  ])('%s the subscriptions when includeSubscriptions is %s', (_description, includeSubscriptions, isSelected) => {
    const query = getProcessListSearchQuery([], includeSubscriptions);

    expect(query.includes('subscriptions { searchEdges { node { subscriptionId description } } }')).toBe(isSelected);
  });
});
