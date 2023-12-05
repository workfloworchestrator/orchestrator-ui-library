export const updateQueryString = (
    queryString: string | undefined,
    fieldName: string,
    value: string,
) => {
    return queryString
        ? `${queryString} ${fieldName}:"${value}"`
        : `${fieldName.toString()}:"${value}"`;
};
