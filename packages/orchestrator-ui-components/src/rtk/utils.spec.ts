import { stripUndefined } from '@/rtk/utils';

describe('stripUndefined', () => {
    it('should remove properties with undefined values', () => {
        const obj = {
            a: 1,
            b: undefined,
            c: 'test',
            d: undefined,
        };

        const result = stripUndefined(obj);

        expect(result).toEqual({
            a: 1,
            c: 'test',
        });
    });

    it('should return the same object if no undefined values are present', () => {
        const obj = {
            a: 1,
            b: 'test',
            c: true,
        };

        const result = stripUndefined(obj);

        expect(result).toEqual({
            a: 1,
            b: 'test',
            c: true,
        });
    });

    it('should return an empty object if all values are undefined', () => {
        const obj = {
            a: undefined,
            b: undefined,
            c: undefined,
        };

        const result = stripUndefined(obj);

        expect(result).toEqual({});
    });

    it('should handle nested objects correctly', () => {
        const obj = {
            a: 1,
            b: undefined,
            c: {
                d: 2,
                e: undefined,
            },
        };

        const result = stripUndefined(obj);

        expect(result).toEqual({
            a: 1,
            c: {
                d: 2,
                e: undefined,
            },
        });
    });

    it('should return an empty object if input is an empty object', () => {
        const obj = {};

        const result = stripUndefined(obj);

        expect(result).toEqual({});
    });

    it('should return the input if it is not a plain object', () => {
        const obj = [undefined, 1, 'test'];

        const result = stripUndefined(obj);

        expect(result).toEqual(obj);
    });
});
