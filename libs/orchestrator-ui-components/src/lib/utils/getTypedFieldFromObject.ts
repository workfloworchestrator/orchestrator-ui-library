export function getTypedFieldFromObject<T extends object>(
    field: string | undefined,
    object: T,
): null | keyof T {
    if (field === undefined || !Object.keys(object).includes(field)) {
        return null;
    }
    return field as keyof T;
}
