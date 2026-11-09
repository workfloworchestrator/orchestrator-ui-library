import { toHexColorWithOpacity } from './toHexColorWithOpacity';

describe('toHexColorWithOpacity', () => {
  it('returns hex color with opacity', () => {
    const hexColor = '#ffffff';
    const opacity = 0.3;

    const result = toHexColorWithOpacity(hexColor, opacity);

    expect(result).toEqual('#ffffff4d');
  });
});
