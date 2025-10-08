export enum WfoQueryParams {
    ACTIVE_TAB = 'activeTab',
    PAGE = 'page',
    PAGE_SIZE = 'pageSize',
    SORT_BY = 'sortBy',
    FILTER_BY = 'filterBy',
    QUERY_STRING = 'queryString',
}

export const getUrlWithQueryParams = (
    url: string,
    params: Partial<Record<WfoQueryParams, string>>,
) => {
    const queryString = new URLSearchParams(params).toString() ?? '';
    return `${url}?${queryString}`;
};
