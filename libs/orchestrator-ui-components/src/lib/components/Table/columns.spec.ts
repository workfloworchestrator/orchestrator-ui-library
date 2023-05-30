import { getSortDirectionFromString, SortDirection } from './columns';

describe('columns', () => {
    describe('getSortDirectionFromString', () => {
        it('should return undefined if sortOrder is undefined', () => {
            expect(getSortDirectionFromString(undefined)).toBeUndefined();
        });
        it('should return SortDirection.Asc if sortOrder is "asc"', () => {
            expect(getSortDirectionFromString('asc')).toEqual(
                SortDirection.Asc,
            );
        });
        it('should return SortDirection.Desc if sortOrder is "desc"', () => {
            expect(getSortDirectionFromString('desc')).toEqual(
                SortDirection.Desc,
            );
        });
        it('should return undefined if sortOrder is anything other than "asc" or "desc', () => {
            expect(getSortDirectionFromString('somethingElse')).toBeUndefined();
        });
    });
});
