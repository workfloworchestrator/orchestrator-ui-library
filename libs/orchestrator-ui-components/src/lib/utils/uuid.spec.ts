import { getFirstUuidPart } from './uuid';

describe('getFirstUuidPart()', () => {
    it('returns the first part of a uuid', () => {
        const result = getFirstUuidPart('12345678-1234-1234-1234-123456789abc');
        expect(result).toEqual('12345678');
    });
});
