export function getTypedFieldFromObject<T extends object>(
    field: string,
    object: T,
): undefined | keyof T {
    if (!Object.keys(object).includes(field)) {
        return undefined;
    }
    return field as keyof T;
}
