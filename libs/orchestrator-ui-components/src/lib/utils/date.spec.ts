import { parseDate, parseDateToLocaleString } from './date';

describe('date', () => {
    describe('parseDate()', () => {
        it('returns null if the date is null', () => {
            const result = parseDate(null);
            expect(result).toBeNull();
        });
        it('returns null if the date is undefined', () => {
            const result = parseDate(undefined);
            expect(result).toBeNull();
        });

        it('returns null if the date is an empty string', () => {
            const result = parseDate('');
            expect(result).toBeNull();
        });

        it('returns a date object if the date is a valid date string', () => {
            const result = parseDate('2022-01-02');

            expect(result).toBeInstanceOf(Date);
        });
    });
    describe('parseDateToLocaleString()', () => {
        it('returns an empty string if the date is null', () => {
            const result = parseDateToLocaleString(null);
            expect(result).toEqual('');
        });

        it('returns a date string if the date is a valid date string', () => {
            const testDate = new Date('2022-01-02');

            const result = parseDateToLocaleString(testDate);

            expect(result).toContain('2-1-2022');
        });
    });
});
