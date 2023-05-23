export function getTypedFieldFromObject<T extends object>(
    field: string,
    object: T,
): null | keyof T {
    if (!Object.keys(object).includes(field)) {
        return null;
    }
    return field as keyof T;
}
