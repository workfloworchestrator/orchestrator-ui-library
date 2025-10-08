import {
    camelToHuman,
    isAllUpperCase,
    isNullOrEmpty,
    removeSuffix,
    snakeToHuman,
    snakeToKebab,
    upperCaseFirstChar,
} from './strings';

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

describe('camelToHuman()', () => {
    it("Doesn't crash on an empty string but returns empty string", () => {
        const result = camelToHuman('');
        expect(result).toEqual('');
    });
    it('Works ok for lowercase strings with length 1', () => {
        const result = camelToHuman('a');
        expect(result).toEqual('A');
    });
    it('Works ok for uppercase strings with length 1', () => {
        const result = camelToHuman('A');
        expect(result).toEqual('A');
    });
    it('Works ok for strings starting with an lowercase char', () => {
        const result = camelToHuman('aQuickBrownFox');
        expect(result).toEqual('A Quick Brown Fox');
    });
    it('Works ok for strings starting with an uppercase char', () => {
        const result = camelToHuman('AQuickBrownFox');
        expect(result).toEqual('A Quick Brown Fox');
    });
});

describe('snakeToHuman()', () => {
    it('Returns an empty string when input is an empty string', () => {
        const result = snakeToHuman('');
        expect(result).toEqual('');
    });
    it('Returns two words from a single underscore snake case word', () => {
        const result = snakeToHuman('hello_world');
        expect(result).toEqual('hello world');
    });
    it('Returns multiple words from a multiple underscore snake case word', () => {
        const result = snakeToHuman('quick_brown_fox');
        expect(result).toEqual('quick brown fox');
    });
});

describe('snakeToKebab()', () => {
    it('Returns an empty string when input is an empty string', () => {
        const result = snakeToKebab('');
        expect(result).toEqual('');
    });
    it('Returns kebab case word from a single underscore snake case word', () => {
        const result = snakeToKebab('hello_world');
        expect(result).toEqual('hello-world');
    });
    it('Returns kebab case word from a multiple underscore snake case word', () => {
        const result = snakeToKebab('quick_brown_fox');
        expect(result).toEqual('quick-brown-fox');
    });
});

describe('isAllUpperCase()', () => {
    it('Returns true for an empty string', () => {
        const result = isAllUpperCase('');
        expect(result).toBe(true);
    });
    it('Returns true for a string with all uppercase letters', () => {
        const result = isAllUpperCase('HELLO');
        expect(result).toBe(true);
    });
    it('Returns false for a string with all lowercase letters', () => {
        const result = isAllUpperCase('hello');
        expect(result).toBe(false);
    });
    it('Returns false for a string with mixed case letters', () => {
        const result = isAllUpperCase('Hello');
        expect(result).toBe(false);
    });
    it('Returns true for a string with uppercase letters and non-letter characters', () => {
        const result = isAllUpperCase('HELLO123!');
        expect(result).toBe(true);
    });
    it('Returns false for a string with mixed case letters and non-letter characters', () => {
        const result = isAllUpperCase('Hello123!');
        expect(result).toBe(false);
    });
});

describe('isNullOrEmpty', () => {
    it('should return true for null', () => {
        expect(isNullOrEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
        expect(isNullOrEmpty(undefined)).toBe(true);
    });

    it('should return true for an empty string', () => {
        expect(isNullOrEmpty('')).toBe(true);
    });

    it('should return true for a string with only spaces', () => {
        expect(isNullOrEmpty('   ')).toBe(true);
    });

    it('should return false for a non-empty string', () => {
        expect(isNullOrEmpty('Hello')).toBe(false);
    });

    it('should return false for a string with spaces and text', () => {
        expect(isNullOrEmpty('  Hello  ')).toBe(false);
    });
});
