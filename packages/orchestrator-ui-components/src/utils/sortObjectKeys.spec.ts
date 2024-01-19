import { sortObjectKeys } from './sortObjectKeys';

describe('sortObjectKeys', () => {
    it('sorts the keys of an object', () => {
        const testObject = {
            a: 1,
            b: 2,
            c: 3,
        };
        const sortedObject = sortObjectKeys(testObject, ['b', 'a', 'c']);

        // Verifies order of keys
        expect(Object.keys(sortedObject).join('-')).toEqual('b-a-c');

        // Verifies values
        expect(sortedObject).toEqual({ a: 1, b: 2, c: 3 });
    });
});
