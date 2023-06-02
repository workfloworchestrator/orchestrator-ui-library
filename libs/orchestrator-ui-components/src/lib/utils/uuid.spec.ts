import { sliceUuid } from './uuid';

describe('sliceUuid()', () => {
    it('returns a sliced uuid', () => {
        const result = sliceUuid('12345678-1234-1234-1234-123456789abc');
        expect(result).toEqual('12345678-1234-1234-1234-123456789abc');
    });
});
