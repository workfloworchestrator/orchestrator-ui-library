import {
    parseDate,
    parseDateToLocaleDateTimeString,
    parseDateStringRelativeToToday,
    calculateTimeDifference,
    getCurrentBrowserLocale,
    parseDateRelativeToToday,
    parseIsoString,
} from './date';

const kingsDay2023TimeStamp = 1682589600000;
const kingsDay = new Date(kingsDay2023TimeStamp);
const kingsDayDate = kingsDay.toLocaleDateString(getCurrentBrowserLocale());
const kingsDayTime = kingsDay.toLocaleTimeString(getCurrentBrowserLocale());

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
    describe('parseDateTimeToLocaleString()', () => {
        it('returns an empty string if the date is null', () => {
            const result = parseDateToLocaleDateTimeString(null);
            expect(result).toEqual('');
        });

        it('returns a date string if the date is a valid date string', () => {
            const testDate = new Date('2022-01-02');

            const result = parseDateToLocaleDateTimeString(testDate);

            expect(result).toContain('1/2/2022');
        });
    });

    describe('parseDateRelativeToToday()', () => {
        it('returns an empty string if the date is null', () => {
            const result = parseDateStringRelativeToToday(undefined);
            expect(result).toEqual('');
        });
        it('returns only time when date is today', () => {
            const now = new Date();
            const time = now.toLocaleTimeString(getCurrentBrowserLocale());

            const result = parseDateStringRelativeToToday(now.toISOString());

            expect(result).toEqual(time);
        });
        it('returns date and time when date is not today', () => {
            const kingsDayIsoString = kingsDay.toISOString();

            const result = parseDateStringRelativeToToday(kingsDayIsoString);

            const expectedDateTime = `${kingsDayDate}, ${kingsDayTime}`;
            expect(result).toEqual(expectedDateTime);
        });
        it('returns date and time when date is not today', () => {
            const result = parseDateRelativeToToday(kingsDay);

            const expectedDateTime = `${kingsDayDate}, ${kingsDayTime}`;
            expect(result).toEqual(expectedDateTime);
        });
    });

    describe('parseDateRelativeToToday()', () => {
        it('returns time only when date is today', () => {
            const now = new Date();
            const time = now.toLocaleTimeString(getCurrentBrowserLocale());

            const result = parseDateRelativeToToday(now);

            expect(result).toEqual(time);
        });
        it('returns date and time when date is not today', () => {
            const result = parseDateRelativeToToday(kingsDay);

            const expectedDateTime = `${kingsDayDate}, ${kingsDayTime}`;
            expect(result).toEqual(expectedDateTime);
        });
        it('returns date only when date is not today and requesting "short notation"', () => {
            const result = parseDateRelativeToToday(kingsDay, true);

            expect(result).toEqual(kingsDayDate);
        });
    });

    describe('calculateTimeDifference()', () => {
        it('returns message with one of the dates missing', () => {
            expect(calculateTimeDifference('', '')).toEqual('');
        });

        it('returns appropriate string if the times are the same', () => {
            const from = new Date(kingsDay2023TimeStamp).toISOString();
            expect(calculateTimeDifference(from, from)).toEqual('00:00:00');
        });

        it('returns appropriate string if the timedifference is 1 second', () => {
            const from = new Date(kingsDay2023TimeStamp).toISOString();
            const to = new Date(kingsDay2023TimeStamp + 1000).toISOString();
            expect(calculateTimeDifference(from, to)).toEqual('00:00:01');
        });
        it('returns appropriate string if the timedifference is 1 minute', () => {
            const from = new Date(kingsDay2023TimeStamp).toISOString();
            const to = new Date(
                kingsDay2023TimeStamp + 60000 + 1000,
            ).toISOString();
            expect(calculateTimeDifference(from, to)).toEqual('00:01:01');
        });
        it('returns appropriate string if the timedifference is 1 hour', () => {
            const from = new Date(kingsDay2023TimeStamp).toISOString();
            const to = new Date(
                kingsDay2023TimeStamp + 3600000 + 60000 + 1000,
            ).toISOString();
            expect(calculateTimeDifference(from, to)).toEqual('01:01:01');
        });

        it('returns appropriate string if the timedifference is 10 hour', () => {
            const from = new Date(kingsDay2023TimeStamp).toISOString();
            const to = new Date(
                kingsDay2023TimeStamp + 36000000 + 60000 + 1000,
            ).toISOString();
            expect(calculateTimeDifference(from, to)).toEqual('10:01:01');
        });

        it('returns appropriate string with - if the timedifference is 1 hour', () => {
            const from = new Date(kingsDay2023TimeStamp).toISOString();
            const to = new Date(
                kingsDay2023TimeStamp + 3600000 + 60000 + 1000,
            ).toISOString();
            expect(calculateTimeDifference(to, from)).toEqual('');
        });
    });

    describe('parseIsoString()', () => {
        it('returns the result of the function passed', () => {
            const dateToStringTestFunction = (testDate: Date | null) =>
                testDate?.toISOString().concat('-TEST') ?? 'empty-TEST';
            const dateIsoString = kingsDay.toISOString();

            const result = parseIsoString(dateToStringTestFunction)(
                dateIsoString,
            );

            expect(result).toEqual(`${dateIsoString}-TEST`);
        });
    });
});
