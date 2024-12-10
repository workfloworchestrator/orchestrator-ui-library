import { getFirstUuidPart, isUuid4 } from './uuid';

describe('getFirstUuidPart()', () => {
    it('returns the first part of a uuid', () => {
        const result = getFirstUuidPart('12345678-1234-1234-1234-123456789abc');
        expect(result).toEqual('12345678');
    });

    it('returns empty string for empty uuid', () => {
        const result = getFirstUuidPart();
        expect(result).toEqual('');
    });
});

describe('isUuid4()', () => {
    it('check non valid UUID4', () => {
        const result = isUuid4('12345678-1234-1234-1234-123456789abc');
        expect(result).toEqual(false);
    });
    it('check valid UUID4', () => {
        const result = isUuid4('b59840ea-f1fb-44e9-88a0-b99583a2922a');
        expect(result).toEqual(true);
    });
});
