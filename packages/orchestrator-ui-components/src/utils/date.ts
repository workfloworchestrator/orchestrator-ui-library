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

export const parseTimeToLocaleString = (value: Date | null) =>
    // Todo #95: Fix default locale (guess it via browser lang?)
    value?.toLocaleTimeString(DUTCH_LOCALE) ?? '';

export const parseDateRelativeToToday = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = parseDate(dateString);
    if (date?.toLocaleDateString() === new Date().toLocaleDateString()) {
        return parseTimeToLocaleString(date);
    } else {
        return parseDateToLocaleString(date);
    }
};
