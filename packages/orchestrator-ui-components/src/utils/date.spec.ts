import {
    parseDate,
    parseDateToLocaleString,
    parseDateRelativeToToday,
} from './date';

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

    describe('parseDateRelativeToToday()', () => {
        it('returns an empty string if the date is null', () => {
            const result = parseDateRelativeToToday(undefined);
            expect(result).toEqual('');
        });
        it('returns only time when date is today', () => {
            const now = new Date();
            const time = now.toLocaleTimeString('nl-NL');
            const result = parseDateRelativeToToday(now.toLocaleString());
            expect(result).toEqual(time);
        });
        it('returns date and time when date is not today', () => {
            const kingsDay = new Date(1682589600000);
            const date = kingsDay.toLocaleDateString('nl-NL');
            const time = kingsDay.toLocaleTimeString('nl-NL');
            const dateTime = `${date} ${time}`;
            const result = parseDateRelativeToToday(kingsDay.toLocaleString());
            expect(result).toEqual(dateTime);
        });
    });
});
