import { toPercentage } from './integer';

describe('toPercentage()', () => {
  it('converts a fraction to a percentage string with one decimal', () => {
    expect(toPercentage(0.5)).toEqual('50.0%');
  });
  it('converts 1 to 100.0%', () => {
    expect(toPercentage(1)).toEqual('100.0%');
  });
  it('converts 0 to 0.0%', () => {
    expect(toPercentage(0)).toEqual('0.0%');
  });
  it('rounds to one decimal place', () => {
    expect(toPercentage(0.12345)).toEqual('12.3%');
    expect(toPercentage(0.6789)).toEqual('67.9%');
  });
  it('handles fractions greater than 1', () => {
    expect(toPercentage(1.5)).toEqual('150.0%');
  });
});
