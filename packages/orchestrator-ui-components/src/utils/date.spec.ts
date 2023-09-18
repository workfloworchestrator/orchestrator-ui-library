import {
    parseDate,
    parseDateTimeToLocaleString,
    parseDateRelativeToToday,
    calculateTimeDifference,
} from './date';

const kingsDay2023TimeStamp = 1682589600000;

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
            const result = parseDateTimeToLocaleString(null);
            expect(result).toEqual('');
        });

        it('returns a date string if the date is a valid date string', () => {
            const testDate = new Date('2022-01-02');

            const result = parseDateTimeToLocaleString(testDate);

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
            const kingsDay = new Date(kingsDay2023TimeStamp);
            const date = kingsDay.toLocaleDateString('nl-NL');
            const time = kingsDay.toLocaleTimeString('nl-NL');
            const dateTime = `${date} ${time}`;

            const result = parseDateRelativeToToday(kingsDay.toLocaleString());

            expect(result).toEqual(dateTime);
        });
    });
    describe('calculateTimeDifference()', () => {
        it('returns message with one of the dates missing', () => {
            expect(calculateTimeDifference('', '')).toEqual('');
        });

        it('returns appropriate string if the times are the same', () => {
            const from = new Date(kingsDay2023TimeStamp).toLocaleDateString();
            expect(calculateTimeDifference(from, from)).toEqual('00:00:00');
        });

        it('returns appropriate string if the timedifference is 1 second', () => {
            const from = new Date(kingsDay2023TimeStamp).toLocaleString();
            const to = new Date(kingsDay2023TimeStamp + 1000).toLocaleString();
            expect(calculateTimeDifference(from, to)).toEqual('00:00:01');
        });
        it('returns appropriate string if the timedifference is 1 minute', () => {
            const from = new Date(kingsDay2023TimeStamp).toLocaleString();
            const to = new Date(
                kingsDay2023TimeStamp + 60000 + 1000,
            ).toLocaleString();
            expect(calculateTimeDifference(from, to)).toEqual('00:01:01');
        });
        it('returns appropriate string if the timedifference is 1 hour', () => {
            const from = new Date(kingsDay2023TimeStamp).toLocaleString();
            const to = new Date(
                kingsDay2023TimeStamp + 3600000 + 60000 + 1000,
            ).toLocaleString();
            expect(calculateTimeDifference(from, to)).toEqual('01:01:01');
        });

        it('returns appropriate string if the timedifference is 10 hour', () => {
            const from = new Date(kingsDay2023TimeStamp).toLocaleString();
            const to = new Date(
                kingsDay2023TimeStamp + 36000000 + 60000 + 1000,
            ).toLocaleString();
            expect(calculateTimeDifference(from, to)).toEqual('10:01:01');
        });

        it('returns appropriate string with - if the timedifference is 1 hour', () => {
            const from = new Date(kingsDay2023TimeStamp).toLocaleString();
            const to = new Date(
                kingsDay2023TimeStamp + 3600000 + 60000 + 1000,
            ).toLocaleString();
            expect(calculateTimeDifference(to, from)).toEqual('');
        });
    });
});
