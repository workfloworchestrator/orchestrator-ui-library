export const parseDate = (date: string | null): Date | null => {
    if (date === null || date === '') {
        return null;
    }

    return new Date(parseInt(date) * 1000);
};
