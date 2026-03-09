import { toObjectWithSortedKeys } from './toObjectWithSortedKeys';

describe('toObjectWithSortedKeys', () => {
  it('sorts the keys of an object', () => {
    const testObject = {
      a: 1,
      b: 2,
      c: 3,
    };
    const sortedObject = toObjectWithSortedKeys(testObject, ['b', 'a', 'c']);

    // Verifies order of keys
    expect(Object.keys(sortedObject).join('-')).toEqual('b-a-c');

    // Verifies values
    expect(sortedObject).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('handles missing keys in the keyOrder array', () => {
    const testObject = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };
    const sortedObject = toObjectWithSortedKeys(testObject, ['d', 'a']);

    // Verifies order of keys
    expect(Object.keys(sortedObject).join('-')).toEqual('d-a-b-c');

    // Verifies values
    expect(sortedObject).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });
});
