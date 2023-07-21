// Todo #95: Fix default locale
export const DUTCH_LOCALE = 'nl-NL';

export const parseDate = (date: string | null | undefined): Date | null => {
    if (date === null || date === undefined || date === '') {
        return null;
    }

    return new Date(date);
};

export const parseDateToLocaleString = (value: Date | null) =>
    // Todo #95: Fix default locale (guess it via browser lang?)
    value?.toLocaleString(DUTCH_LOCALE) ?? '';
