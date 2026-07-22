import { getCronFieldIndexAtCursor } from './WfoCron';

describe('getCronFieldIndexAtCursor', () => {
  const expression = '*/5 8-17 * JAN mon-fri';

  it('returns the first field for an empty expression', () => {
    expect(getCronFieldIndexAtCursor('', 0)).toEqual(0);
  });

  it('returns the field the cursor is inside', () => {
    expect(getCronFieldIndexAtCursor(expression, 0)).toEqual(0); // |*/5
    expect(getCronFieldIndexAtCursor(expression, 2)).toEqual(0); // */|5
    expect(getCronFieldIndexAtCursor(expression, 3)).toEqual(0); // */5|
    expect(getCronFieldIndexAtCursor(expression, 5)).toEqual(1); // 8|-17
    expect(getCronFieldIndexAtCursor(expression, 9)).toEqual(2); // |*
    expect(getCronFieldIndexAtCursor(expression, 12)).toEqual(3); // J|AN
    expect(getCronFieldIndexAtCursor(expression, 22)).toEqual(4); // mon-fri|
  });

  it('returns the next field when the cursor is after a separating space', () => {
    expect(getCronFieldIndexAtCursor(expression, 4)).toEqual(1); // */5 |8-17
    expect(getCronFieldIndexAtCursor(expression, 15)).toEqual(4); // JAN |mon-fri
  });

  it('handles multiple consecutive spaces', () => {
    expect(getCronFieldIndexAtCursor('*  *', 1)).toEqual(0);
    expect(getCronFieldIndexAtCursor('*  *', 2)).toEqual(1);
    expect(getCronFieldIndexAtCursor('*  *', 3)).toEqual(1);
  });

  it('never exceeds the last cron field', () => {
    expect(getCronFieldIndexAtCursor('* * * * * * extra', 17)).toEqual(5);
  });

  it('handles leading whitespace', () => {
    expect(getCronFieldIndexAtCursor('  * * * * *', 1)).toEqual(0);
    expect(getCronFieldIndexAtCursor('  * * * * *', 3)).toEqual(0);
  });
});
