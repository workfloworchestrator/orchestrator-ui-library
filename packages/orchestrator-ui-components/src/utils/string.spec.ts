import { removeSuffix, upperCaseFirstChar } from './strings';

describe('upperCaseFirstChar()', () => {
    it("Doesn't crash on an empty string but returns empty string", () => {
        const result = upperCaseFirstChar('');
        expect(result).toEqual('');
    });
    it('Uppercases strings of length 1', () => {
        const result = upperCaseFirstChar('a');
        expect(result).toEqual('A');
    });
    it('Uppercases strings simple strings', () => {
        const result = upperCaseFirstChar('subscriptions');
        expect(result).toEqual('Subscriptions');
    });
    it('Uppercases strings simple strings and spaces', () => {
        const result = upperCaseFirstChar('subscriptions are ok');
        expect(result).toEqual('Subscriptions are ok');
    });
    it('Uppercases / lowercases strings with all caps', () => {
        const result = upperCaseFirstChar('ALL');
        expect(result).toEqual('All');
    });
});

describe('removeSuffix()', () => {
    it("Doesn't crash on an empty string but returns empty string", () => {
        const result = removeSuffix('');
        expect(result).toEqual('');
    });
    it('Works ok for strings with length 1', () => {
        const result = removeSuffix('a');
        expect(result).toEqual('a');
    });
    it('Works ok for strings with default splitChar', () => {
        const result = removeSuffix('a?b');
        expect(result).toEqual('a');
    });
    it('Works ok for strings with specified splitChar', () => {
        const result = removeSuffix('a=b', '=');
        expect(result).toEqual('a');
    });
    it('Works ok for strings without splitChar', () => {
        const result = removeSuffix('a=b');
        expect(result).toEqual('a=b');
    });
});
