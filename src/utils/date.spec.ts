import {
  calculateTimeDifference,
  getCurrentBrowserLocale,
  parseDate,
  parseDateOrTimeRelativeToToday,
  parseDateRelativeToToday,
  parseDateToLocaleDateTimeString,
  parseIsoString,
} from './date';

const testDateIsoString = '2023-04-27T10:00:00.000Z';
const testDate = new Date(testDateIsoString);
const testDateEpoch = testDate.valueOf();
const testDateDateString = testDate.toLocaleDateString(getCurrentBrowserLocale());
const testDateTimeString = testDate.toLocaleTimeString(getCurrentBrowserLocale());

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
      const result = parseDateRelativeToToday(null);
      expect(result).toEqual('');
    });
    it('returns only time when date is today', () => {
      const now = new Date();

      const result = parseDateRelativeToToday(now);

      const expectedResult = now.toLocaleTimeString(getCurrentBrowserLocale());
      expect(result).toEqual(expectedResult);
    });
    it('returns date and time when date is not today', () => {
      const result = parseDateRelativeToToday(testDate);

      const expectedDateTime = `${testDateDateString}, ${testDateTimeString}`;
      expect(result).toEqual(expectedDateTime);
    });
  });

  describe('parseDateOrTimeRelativeToToday()', () => {
    it('returns time only when date is today', () => {
      const now = new Date();

      const result = parseDateOrTimeRelativeToToday(now);

      const expectedResult = now.toLocaleTimeString(getCurrentBrowserLocale());
      expect(result).toEqual(expectedResult);
    });
    it('returns only the date when that date is not today', () => {
      const result = parseDateOrTimeRelativeToToday(testDate);

      expect(result).toEqual(testDateDateString);
    });
    it('returns date only when date is not today and requesting "short notation"', () => {
      const result = parseDateOrTimeRelativeToToday(testDate);

      expect(result).toEqual(testDateDateString);
    });
  });

  describe('calculateTimeDifference()', () => {
    it('returns message with one of the dates missing', () => {
      expect(calculateTimeDifference('', '')).toEqual('');
    });

    it('returns appropriate string if the times are the same', () => {
      expect(calculateTimeDifference(testDateIsoString, testDateIsoString)).toEqual('00:00:00');
    });

    it('returns appropriate string if the timedifference is 1 second', () => {
      const laterTestDateIsoString = new Date(testDateEpoch + 1000).toISOString();

      const result = calculateTimeDifference(testDateIsoString, laterTestDateIsoString);

      expect(result).toEqual('00:00:01');
    });
    it('returns appropriate string if the timedifference is 1 minute', () => {
      const laterTestDateIsoString = new Date(testDateEpoch + 60000 + 1000).toISOString();

      const result = calculateTimeDifference(testDateIsoString, laterTestDateIsoString);

      expect(result).toEqual('00:01:01');
    });
    it('returns appropriate string if the timedifference is 1 hour', () => {
      const laterTestDateIsoString = new Date(testDateEpoch + 3600000 + 60000 + 1000).toISOString();

      const result = calculateTimeDifference(testDateIsoString, laterTestDateIsoString);

      expect(result).toEqual('01:01:01');
    });

    it('returns appropriate string if the timedifference is 10 hour', () => {
      const laterTestDateIsoString = new Date(testDateEpoch + 36000000 + 60000 + 1000).toISOString();

      const result = calculateTimeDifference(testDateIsoString, laterTestDateIsoString);

      expect(result).toEqual('10:01:01');
    });

    it('returns empty string when time difference is invalid', () => {
      const laterDateIsoString = new Date(testDateEpoch + 3600000 + 60000 + 1000).toISOString();

      const result = calculateTimeDifference(laterDateIsoString, testDateIsoString);

      expect(result).toEqual('');
    });
  });

  describe('parseIsoString()', () => {
    it('returns the result of the function passed', () => {
      const dateToStringTestFunction = (testDate: Date | null) =>
        testDate?.toISOString().concat('-TEST') ?? 'empty-TEST';

      const result = parseIsoString(dateToStringTestFunction)(testDateIsoString);

      expect(result).toEqual(`${testDateIsoString}-TEST`);
    });
  });
});
