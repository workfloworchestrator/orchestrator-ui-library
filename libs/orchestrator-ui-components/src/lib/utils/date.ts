// Todo #95: Fix default locale
export const DUTCH_LOCALE = 'nl-NL';

export const parseDate = (date: string | null | undefined): Date | null => {
    if (date === null || date === undefined || date === '') {
        return null;
    }

    // Todo #95: GraphQL Dates will soon be in ISO8601 format instead of a float in a string
    return new Date(parseInt(date) * 1000);
};

export const parseDateToLocaleString = (value: Date | null) =>
    // Todo #95: Fix default locale (guess it via browser lang?)
    value?.toLocaleString(DUTCH_LOCALE) ?? '';
