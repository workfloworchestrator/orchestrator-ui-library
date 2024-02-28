import { onlyUnique } from './onlyUnique';

describe('onlyUnique()', () => {
    it('returns array as array with only unique values', () => {
        const test1 = ['SP', 'SP', 'FW', 'SP', 'FW', 'LP'];
        const result = test1?.filter(onlyUnique);
        expect(result).toEqual(['SP', 'FW', 'LP']);
    });
    it('returns array as array with only single value', () => {
        const test2 = ['SP', 'SP', 'SP'];
        const result = test2?.filter(onlyUnique);
        expect(result).toEqual(['SP']);
    });
    it('returns array as empty array', () => {
        const test3 = [''];
        const result = test3?.filter(onlyUnique);
        expect(result).toEqual(['']);
    });
});
