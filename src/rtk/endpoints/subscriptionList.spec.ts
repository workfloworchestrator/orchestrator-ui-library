import { getGraphqlField, getSubscriptionListSearchQuery, getSubscriptionNodeSelection } from './subscriptionList';

describe('getGraphqlField()', () => {
  it('removes the entity from the search path', () => {
    expect(getGraphqlField('subscription.description')).toBe('description');
  });

  it('camelCases snake_case parts', () => {
    expect(getGraphqlField('subscription.subscription_id')).toBe('subscriptionId');
  });

  it('keeps nested paths', () => {
    expect(getGraphqlField('subscription.product.name')).toBe('product.name');
  });

  it('uses the override for the customer columns', () => {
    expect(getGraphqlField('subscription.customer_name')).toBe('customer.fullname');
    expect(getGraphqlField('subscription.customer_abbreviation')).toBe('customer.shortcode');
  });
});

describe('getSubscriptionNodeSelection()', () => {
  it('always selects the subscriptionId', () => {
    expect(getSubscriptionNodeSelection([])).toBe('subscriptionId');
  });

  it('selects the GraphQL field of each search path', () => {
    expect(getSubscriptionNodeSelection(['subscription.start_date', 'subscription.note'])).toBe(
      ['subscriptionId', 'startDate', 'note'].join('\n'),
    );
  });

  it('nests selections of nested paths', () => {
    expect(getSubscriptionNodeSelection(['subscription.product.name', 'subscription.customer_name'])).toBe(
      ['subscriptionId', 'product { name }', 'customer { fullname }'].join('\n'),
    );
  });
});

describe('getSubscriptionListSearchQuery()', () => {
  it('puts the node selection in the query', () => {
    const query = getSubscriptionListSearchQuery(['subscription.product.name']);

    expect(query).toContain('query SubscriptionsListSearch(');
    expect(query).toContain('subscriptionId\n');
    expect(query).toContain('product { name }');
    expect(query).not.toContain('startDate');
  });
});
