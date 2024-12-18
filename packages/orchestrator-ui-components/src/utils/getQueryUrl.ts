export const getQueryUrl = (pageUrl: string, queryString: string) => {
    return `${pageUrl}?queryString=${queryString}`;
};
