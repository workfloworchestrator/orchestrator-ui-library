import { getCountColor } from './getCountColor';

describe('getCountColor', () => {
  it.each([
    [3, 'danger'],
    ['3', 'danger'],
    [0, 'success'],
    [-1, 'success'],
    ['-', 'info'],
    ['', 'info'],
    [' ', 'info'],
  ] as const)('count %p is %s', (count, expectedColor) => expect(getCountColor(count)).toBe(expectedColor));
});
