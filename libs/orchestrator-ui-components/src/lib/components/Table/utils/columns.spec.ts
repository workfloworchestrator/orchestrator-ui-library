import { getSortDirectionFromString, SortDirection } from './columns';

describe('columns', () => {
    describe('getSortDirectionFromString', () => {
        it('returns undefined if sortOrder is undefined', () => {
            const result = getSortDirectionFromString(undefined);
            expect(result).toBeUndefined();
        });
        it('returns SortDirection.Asc if sortOrder is "asc"', () => {
            const result = getSortDirectionFromString('asc');
            expect(result).toEqual(SortDirection.Asc);
        });
        it('returns SortDirection.Desc if sortOrder is "desc"', () => {
            const result = getSortDirectionFromString('desc');
            expect(result).toEqual(SortDirection.Desc);
        });
        it('returns undefined if sortOrder is anything other than "asc" or "desc', () => {
            const result = getSortDirectionFromString('somethingElse');
            expect(result).toBeUndefined();
        });
    });
});
