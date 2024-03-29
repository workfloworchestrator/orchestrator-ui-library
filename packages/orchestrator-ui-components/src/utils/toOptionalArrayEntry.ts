export const toOptionalArrayEntry = <T>(
    data: T,
    condition: boolean,
): [T] | [] => (condition ? [data] : []);
