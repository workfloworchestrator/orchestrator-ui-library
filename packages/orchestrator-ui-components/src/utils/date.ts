// Todo #95: Fix default locale
export const DUTCH_LOCALE = 'nl-NL';

export const parseDate = (date: string | null | undefined): Date | null => {
    if (date === null || date === undefined || date === '') {
        return null;
    }

    return new Date(date);
};

export const calculateTimeDifference = (from: string, to: string): string => {
    const fromDate = parseDate(from);
    const toDate = parseDate(to);

    if (!fromDate || !toDate) return 'missing paramater';

    const timeDifference: number =
        (toDate.getTime() - fromDate.getTime()) / 1000;

    if (timeDifference < 0) return 'negative difference';

    const seconds = Math.floor(timeDifference);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours.toString().padStart(2, '0')}:${(minutes % 60)
        .toString()
        .padStart(2, '0')}:${((seconds % 60) % 3600)
        .toString()
        .padStart(2, '0')}`;
};

export const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';

    const date = parseDate(dateString);
    return parseDateToLocaleString(date);
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
