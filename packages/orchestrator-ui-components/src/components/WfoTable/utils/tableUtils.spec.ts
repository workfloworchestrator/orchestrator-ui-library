import { SortOrder } from '../../../types';
import {
    determineNewSortOrder,
    determinePageIndex,
    hasSpecialCharacterOrSpace,
} from './tableUtils';

describe('tableUtils', () => {
    describe('determinePageIndex()', () => {
        it('returns page 0', () => {
            const result = determinePageIndex(9, 10);
            expect(result).toEqual(0);
        });

        it('returns page 1', () => {
            const result = determinePageIndex(10, 10);
            expect(result).toEqual(1);
        });

        it('returns page 1', () => {
            const result = determinePageIndex(11, 10);
            expect(result).toEqual(1);
        });
    });

    describe('determineNewSortOrder', () => {
        type TestData = {
            column1: object;
            column2: object;
        };

        it('returns SortDirection.Asc when sorting on a new column', () => {
            const currentSortColumnId = 'column1';
            const currentSortDirection = SortOrder.ASC;
            const newSortColumnId = 'column2';

            const result = determineNewSortOrder<TestData>(
                currentSortColumnId,
                currentSortDirection,
                newSortColumnId,
            );

            expect(result).toEqual(SortOrder.ASC);
        });

        it('returns SortDirection.Asc when sorting on the same column with SortDirection.Desc', () => {
            const currentSortColumnId = 'column1';
            const currentSortDirection = SortOrder.DESC;
            const newSortColumnId = 'column1';

            const result = determineNewSortOrder<TestData>(
                currentSortColumnId,
                currentSortDirection,
                newSortColumnId,
            );

            expect(result).toEqual(SortOrder.ASC);
        });

        it('returns SortDirection.Desc when sorting on the same column with SortDirection.Asc', () => {
            const currentSortColumnId = 'column1';
            const currentSortDirection = SortOrder.DESC;
            const newSortColumnId = 'column1';

            const result = determineNewSortOrder<TestData>(
                currentSortColumnId,
                currentSortDirection,
                newSortColumnId,
            );

            expect(result).toEqual(SortOrder.ASC);
        });
    });

    describe('hasSpecialCharacterOrSpace', () => {
        it('should return true for strings with special characters', () => {
            expect(hasSpecialCharacterOrSpace('hello@world')).toBe(true);
            expect(hasSpecialCharacterOrSpace('hello#world')).toBe(true);
            expect(hasSpecialCharacterOrSpace('hello!world')).toBe(true);
        });

        it('should return true for strings with spaces', () => {
            expect(hasSpecialCharacterOrSpace('hello world')).toBe(true);
            expect(hasSpecialCharacterOrSpace('hello  world')).toBe(true);
        });

        it('should return false for strings with only alphanumeric characters', () => {
            expect(hasSpecialCharacterOrSpace('helloworld')).toBe(false);
            expect(hasSpecialCharacterOrSpace('hello123')).toBe(false);
            expect(hasSpecialCharacterOrSpace('123456')).toBe(false);
        });

        it('should return true for strings with mixed alphanumeric and special characters', () => {
            expect(hasSpecialCharacterOrSpace('hello123@world')).toBe(true);
            expect(hasSpecialCharacterOrSpace('123#world')).toBe(true);
        });

        it('should return false for empty strings', () => {
            expect(hasSpecialCharacterOrSpace('')).toBe(false);
        });

        it('should return true for strings with only special characters', () => {
            expect(hasSpecialCharacterOrSpace('@#$%^&*')).toBe(true);
        });
    });
});
