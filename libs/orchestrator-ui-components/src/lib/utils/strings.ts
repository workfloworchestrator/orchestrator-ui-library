export const upperCaseFirstChar = (value: string): string => {
    if (value.length === 0) return value;
    if (value.length === 1) return value.charAt(0).toUpperCase();
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};
