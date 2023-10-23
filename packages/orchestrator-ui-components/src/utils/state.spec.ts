import { stateDelta } from './state';

describe('stateDelta()', () => {
    it("Doesn't crash on an comparison of two empty states", () => {
        const result = stateDelta({}, {});
        expect(result).toEqual({});
    });
    it("Doesn't crash on an comparison of one empty states", () => {
        const result = stateDelta(
            {},
            {
                test: true,
            },
        );
        expect(result).toEqual({ test: true });
    });
    it('It only shows changes on the right side as state grows', () => {
        const result = stateDelta(
            {
                test: true,
            },
            {},
        );
        expect(result).toEqual({});
    });
    it('It shows the delta', () => {
        const result = stateDelta(
            {
                test: true,
            },
            { test: true, number: 3, string: 'string' },
        );
        expect(result).toEqual({ number: 3, string: 'string' });
    });
});
