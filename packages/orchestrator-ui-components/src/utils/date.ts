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
    return parseDateTimeToLocaleString(date);
};

export const parseDateTimeToLocaleString = (value: Date | null) =>
    value?.toLocaleString(navigator.language) ?? '';

export const parseDateToLocaleString = (value: Date | null) =>
    value?.toLocaleDateString(navigator.language) ?? '';

export const parseTimeToLocaleString = (value: Date | null) =>
    value?.toLocaleTimeString(navigator.language) ?? '';

export const parseDateRelativeToToday = (
    dateString: string | undefined,
    eitherDateOrTime: boolean = false,
) => {
    if (!dateString) return '';
    const date = parseDate(dateString);

    if (date?.toLocaleDateString() === new Date().toLocaleDateString()) {
        return parseTimeToLocaleString(date);
    }

    return eitherDateOrTime
        ? parseDateToLocaleString(date)
        : parseDateTimeToLocaleString(date);
};
