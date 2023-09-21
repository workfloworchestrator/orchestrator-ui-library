export const getCurrentBrowserLocale = () => window.navigator.language;

export const parseDate = (date: string | null | undefined): Date | null => {
    if (date === null || date === undefined || date === '') {
        return null;
    }

    return new Date(date);
};

export const calculateTimeDifference = (from: string, to: string): string => {
    const fromDate = parseDate(from);
    const toDate = parseDate(to);

    if (!fromDate || !toDate) return '';

    const timeDifference: number =
        (toDate.getTime() - fromDate.getTime()) / 1000;

    if (timeDifference < 0) return '';

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
    return parseDateToLocaleDateTimeString(date);
};

export const parseIsoString =
    (dateToStringParser: (date: Date | null) => string) =>
    (date: string | null) =>
        dateToStringParser(parseDate(date));

export const parseDateToLocaleDateTimeString = (value: Date | null) =>
    value?.toLocaleString(getCurrentBrowserLocale()) ?? '';

export const parseDateToLocaleDateString = (value: Date | null) =>
    value?.toLocaleDateString(getCurrentBrowserLocale()) ?? '';

export const parseDateToLocaleTimeString = (value: Date | null) =>
    value?.toLocaleTimeString(getCurrentBrowserLocale()) ?? '';

export const isToday = (date: Date) =>
    date.toLocaleDateString() === new Date().toLocaleDateString();

export const parseDateOrTimeRelativeToToday = (date: Date | null) => {
    if (!date) {
        return '';
    }

    return isToday(date)
        ? parseDateToLocaleTimeString(date)
        : parseDateToLocaleDateString(date);
};

export const parseDateRelativeToToday = (date: Date | null) => {
    if (!date) {
        return '';
    }

    return isToday(date)
        ? parseDateToLocaleTimeString(date)
        : parseDateToLocaleDateTimeString(date);
};
