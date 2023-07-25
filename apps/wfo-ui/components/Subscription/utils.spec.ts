import { getColor } from './utils';

describe('getColor()', () => {
    it('returns "error" when color is 0', () => {
        const result = getColor(0);
        expect(result).toEqual('error');
    });
    it('returns "warning" when color is 1', () => {
        const result = getColor(1);
        expect(result).toEqual('warning');
    });
    it('returns "primary" when color is 2', () => {
        const result = getColor(2);
        expect(result).toEqual('primary');
    });
});
