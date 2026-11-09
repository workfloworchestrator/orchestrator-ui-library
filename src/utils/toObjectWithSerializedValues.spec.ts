import { toObjectWithSerializedValues } from '@/utils/toObjectWithSerializedValues';

describe('toObjectWithSerializedValues()', () => {
  it('should serialize object fields', () => {
    const input = {
      testObject: { foo: 'bar' },
    };

    const result = toObjectWithSerializedValues(input);

    expect(result.testObject).toEqual(`{"foo":"bar"}`);
  });

  it('should not serialize date fields', () => {
    const testDate = new Date();
    const input = {
      date: testDate,
    };

    const result = toObjectWithSerializedValues(input);

    expect(result.date).toEqual(testDate);
  });

  it('should not serialize non-date and non-object fields', () => {
    const input = {
      string: 'string',
      number: 1,
      boolean: true,
    };

    const result = toObjectWithSerializedValues(input);

    expect(result).toEqual(input);
  });
});
