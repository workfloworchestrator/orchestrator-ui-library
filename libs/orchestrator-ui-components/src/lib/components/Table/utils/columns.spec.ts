import { getSortDirectionFromString } from './columns';
import { SortOrder } from '../../types';

describe('columns', () => {
    describe('getSortOrderFromString', () => {
        it('returns undefined if sortOrder is undefined', () => {
            const result = getSortDirectionFromString(undefined);
            expect(result).toBeUndefined();
        });
        it('returns SortDirection.Asc if sortOrder is "asc"', () => {
            const result = getSortDirectionFromString('asc');
            expect(result).toEqual(SortOrder.Asc);
        });
        it('returns SortDirection.Desc if sortOrder is "desc"', () => {
            const result = getSortDirectionFromString('desc');
            expect(result).toEqual(SortOrder.Desc);
        });
        it('returns undefined if sortOrder is anything other than "asc" or "desc', () => {
            const result = getSortDirectionFromString('somethingElse');
            expect(result).toBeUndefined();
        });
    });
});
