import { getCronFieldIndexAtCursor, getCronFieldLayout } from './WfoCron';

describe('getCronFieldLayout', () => {
  it('returns the 5 field layout starting with minute for an empty expression', () => {
    expect(getCronFieldLayout('')).toEqual(['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek']);
  });

  it('returns the 5 field layout starting with minute for a 5 field expression', () => {
    expect(getCronFieldLayout('5 4 * JAN *')).toEqual(['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek']);
  });

  it('returns the 6 field layout starting with second for a 6 field expression', () => {
    expect(getCronFieldLayout('0 5 4 * JAN *')).toEqual([
      'second',
      'minute',
      'hour',
      'dayOfMonth',
      'month',
      'dayOfWeek',
    ]);
  });
});

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

  it('never exceeds the last field of the active layout', () => {
    expect(getCronFieldIndexAtCursor('1 2 3 4 5 ', 10)).toEqual(4);
    expect(getCronFieldIndexAtCursor('* * * * * * extra', 17)).toEqual(5);
  });

  it('handles leading whitespace', () => {
    expect(getCronFieldIndexAtCursor('  * * * * *', 1)).toEqual(0);
    expect(getCronFieldIndexAtCursor('  * * * * *', 3)).toEqual(0);
  });

  it('maps the first field to minute for 5 fields and to second for 6 fields', () => {
    const fiveFieldExpression = '5 4 * JAN *';
    expect(getCronFieldLayout(fiveFieldExpression)[getCronFieldIndexAtCursor(fiveFieldExpression, 1)]).toEqual(
      'minute',
    );

    const sixFieldExpression = '0 5 4 * JAN *';
    expect(getCronFieldLayout(sixFieldExpression)[getCronFieldIndexAtCursor(sixFieldExpression, 1)]).toEqual('second');
  });
});
