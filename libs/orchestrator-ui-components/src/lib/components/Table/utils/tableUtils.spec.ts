import { determinePageIndex, determineNewSortOrder } from './tableUtils';
import { SortOrder } from '../../types';

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
        const testData = {
            column1: {},
            column2: {},
        };

        it('returns SortDirection.Asc when sorting on a new column', () => {
            const currentSortColumnId = 'column1';
            const currentSortDirection = SortOrder.Asc;
            const newSortColumnId = 'column2';

            const result = determineNewSortOrder<typeof testData>(
                currentSortColumnId,
                currentSortDirection,
                newSortColumnId,
            );

            expect(result).toEqual(SortOrder.Asc);
        });

        it('returns SortDirection.Asc when sorting on the same column with SortDirection.Desc', () => {
            const currentSortColumnId = 'column1';
            const currentSortDirection = SortOrder.Desc;
            const newSortColumnId = 'column1';

            const result = determineNewSortOrder<typeof testData>(
                currentSortColumnId,
                currentSortDirection,
                newSortColumnId,
            );

            expect(result).toEqual(SortOrder.Asc);
        });

        it('returns SortDirection.Desc when sorting on the same column with SortDirection.Asc', () => {
            const currentSortColumnId = 'column1';
            const currentSortDirection = SortOrder.Desc;
            const newSortColumnId = 'column1';

            const result = determineNewSortOrder<typeof testData>(
                currentSortColumnId,
                currentSortDirection,
                newSortColumnId,
            );

            expect(result).toEqual(SortOrder.Asc);
        });
    });
});
