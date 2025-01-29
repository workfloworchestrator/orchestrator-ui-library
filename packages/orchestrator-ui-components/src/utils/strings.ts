export const upperCaseFirstChar = (value: string): string => {
    if (value.length === 0) return value;
    if (value.length === 1) return value.charAt(0).toUpperCase();
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const removeSuffix = (value: string, splitChar = '?'): string => {
    if (value.length <= 1 || !value.includes(splitChar)) return value;
    return value.split(splitChar).slice(0, -1).join();
};

export const camelToHuman = (value: string): string => {
    const result = value.replace(/([A-Z])/g, ' $1').trimStart();
    return result.charAt(0).toUpperCase() + result.slice(1);
};

export const snakeToHuman = (value: string): string => {
    const result = value.replace(/_/g, ' ');
    return result.charAt(0) + result.slice(1);
};

export const snakeToKebab = (value: string): string => {
    return value.replace(/_/g, '-');
};

export const isAllUpperCase = (str: string) => str === str.toUpperCase();

export const isNullOrEmpty = (str: string | null | undefined): boolean => {
    return str === null || str === undefined || str.trim() === '';
};

export const INVISIBLE_CHARACTER = '‎';
