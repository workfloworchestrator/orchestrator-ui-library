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
