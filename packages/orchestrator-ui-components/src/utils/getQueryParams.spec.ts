import { WfoQueryParams, getUrlWithQueryParams } from './getQueryParams';

describe('getUrlWithQueryParams', () => {
  it('should build URL with one query param', () => {
    const url = '/api/list';
    const params = { [WfoQueryParams.ACTIVE_TAB]: 'ALL' };
    expect(getUrlWithQueryParams(url, params)).toBe('/api/list?activeTab=ALL');
  });

  it('should build URL with multiple params', () => {
    const url = '/api/list';
    const params = {
      [WfoQueryParams.ACTIVE_TAB]: 'ALL',
      [WfoQueryParams.PAGE]: '2',
      [WfoQueryParams.SORT_BY]: 'field-startDate_order-ASC',
    };
    const result = getUrlWithQueryParams(url, params);

    expect(result).toContain('/api/list?');
    expect(result).toContain('activeTab=ALL');
    expect(result).toContain('page=2');
    expect(result).toContain('sortBy=field-startDate_order-ASC');
  });

  it('should encode params properly', () => {
    const url = '/items';
    const params = {
      [WfoQueryParams.QUERY_STRING]: 'status:(provisioning|active) insync:false',
    };

    expect(getUrlWithQueryParams(url, params)).toBe(
      '/items?queryString=status%3A%28provisioning%7Cactive%29+insync%3Afalse',
    );
  });

  it('should handle empty params object', () => {
    const url = '/no-params';
    expect(getUrlWithQueryParams(url, {})).toBe('/no-params?');
  });
});
