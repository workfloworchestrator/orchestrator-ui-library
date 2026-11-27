import { joinClassNames } from './joinClassNames';

describe('joinClassNames', () => {
  it('joins class names with a space', () => expect(joinClassNames('a', 'b')).toBe('a b'));
  it('skips empty and false values', () => expect(joinClassNames('a', false, undefined, null, '', 'b')).toBe('a b'));
  it('returns an empty string without class names', () => expect(joinClassNames()).toBe(''));
});
