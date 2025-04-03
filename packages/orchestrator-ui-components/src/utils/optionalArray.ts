export const toOptionalArrayEntry = <T>(
    data: T,
    condition: boolean,
): [T] | [] => (condition ? [data] : []);

export const toOptionalArrayEntries = <T>(
    data: T | T[],
    condition: boolean,
): T[] => (condition ? (Array.isArray(data) ? data : [data]) : []);

export const optionalArrayMapper = <T, U>(
    data: T[] | undefined = [],
    mapper: (input: T) => U,
): U[] => data.map(mapper);
