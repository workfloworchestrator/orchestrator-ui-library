import { getNestedSummaryLabel } from '@/components';

describe('getNestedSummaryLabel', () => {
  it('returns string value as-is', () => {
    const labels = ['name', 'age', 'city'];
    expect(getNestedSummaryLabel(labels, 0)).toBe('name');
    expect(getNestedSummaryLabel(labels, 1)).toBe('age');
    expect(getNestedSummaryLabel(labels, 2)).toBe('city');
  });

  it('returns capitalized first key when value is an object', () => {
    const labels = [{ first: 'John', last: 'Doe' }];
    expect(getNestedSummaryLabel(labels, 0)).toBe('First');
  });

  it('handles object with multiple keys', () => {
    const labels = [{ last: 'Doe', first: 'John' }];
    // only the first key should matter
    expect(getNestedSummaryLabel(labels, 0)).toBe('Last');
  });

  it('handles empty object', () => {
    const labels = [{}];
    expect(getNestedSummaryLabel(labels, 0)).toBe('');
  });

  it('handles null and undefined values safely', () => {
    const labels = [null, undefined];
    expect(getNestedSummaryLabel(labels, 0)).toBe('null');
    expect(getNestedSummaryLabel(labels, 1)).toBe('undefined');
  });
});
