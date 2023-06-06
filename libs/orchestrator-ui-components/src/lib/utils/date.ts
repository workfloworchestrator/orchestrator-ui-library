export const DUTCH_LOCALE = 'nl-NL';

export const parseDate = (date: string | null): Date | null => {
    if (date === null || date === '') {
        return null;
    }

    return new Date(parseInt(date) * 1000);
};

export const parseDateToLocaleString = (value: Date | null) =>
    value?.toLocaleString(DUTCH_LOCALE) ?? '';
