import { SortOrder } from '../../../types';
import { determineNewSortOrder, determinePageIndex } from './tableUtils';

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
});
