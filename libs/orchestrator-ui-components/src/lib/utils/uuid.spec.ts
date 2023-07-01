import { containsUuid4, getFirstUuidPart, isUuid4 } from './uuid';

describe('getFirstUuidPart()', () => {
    it('returns the first part of a uuid', () => {
        const result = getFirstUuidPart('12345678-1234-1234-1234-123456789abc');
        expect(result).toEqual('12345678');
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

describe('containsUuid4()', () => {
    it('check only non valid UUID4', () => {
        const result = containsUuid4('12345678-1234-1234-1234-123456789abc');
        expect(result).toEqual(false);
    });
    it('check only valid UUID4', () => {
        const result = containsUuid4('b59840ea-f1fb-44e9-88a0-b99583a2922a');
        expect(result).toEqual(true);
    });
    it('check valid UUID4 with prefix', () => {
        const result = containsUuid4(
            'subscriptions/b59840ea-f1fb-44e9-88a0-b99583a2922a',
        );
        expect(result).toEqual(true);
    });
    it('check non valid UUID4 with prefix', () => {
        const result = containsUuid4(
            'subscriptions/f1fb-44e9-88a0-b99583a2922a',
        );
        expect(result).toEqual(false);
    });
    it('check valid UUID4 with suffix', () => {
        const result = containsUuid4(
            'b59840ea-f1fb-44e9-88a0-b99583a2922a/subscriptions',
        );
        expect(result).toEqual(true);
    });
    it('check non valid UUID4 with suffix', () => {
        const result = containsUuid4('b59840ea-f1fb-44e9-88a0/subscriptions');
        expect(result).toEqual(false);
    });
});
