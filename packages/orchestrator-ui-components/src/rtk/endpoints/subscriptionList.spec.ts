import { getSubscriptionListSearchQuery, getSubscriptionNodeSelection } from './subscriptionList';

describe('getSubscriptionNodeSelection()', () => {
  it('always selects the subscriptionId', () => {
    expect(getSubscriptionNodeSelection([])).toBe('subscriptionId');
  });

  it('selects each requested field', () => {
    expect(getSubscriptionNodeSelection(['startDate', 'note'])).toBe(
      ['subscriptionId', 'startDate', 'note'].join('\n'),
    );
  });

  it('nests selections of nested fields', () => {
    expect(getSubscriptionNodeSelection(['product.name', 'customer.fullname'])).toBe(
      ['subscriptionId', 'product { name }', 'customer { fullname }'].join('\n'),
    );
  });
});

describe('getSubscriptionListSearchQuery()', () => {
  it('puts the node selection in the query', () => {
    const query = getSubscriptionListSearchQuery(['product.name']);

    expect(query).toContain('query SubscriptionsListSearch(');
    expect(query).toContain('subscriptionId\n');
    expect(query).toContain('product { name }');
    expect(query).not.toContain('startDate');
  });
});
