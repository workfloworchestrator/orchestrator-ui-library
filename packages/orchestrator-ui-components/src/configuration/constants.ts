export const MAXIMUM_ITEMS_FOR_BULK_FETCHING = 1000;

// Graphql typically returns items paginated, this number represents "all items"
export const NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS = 1000000;

// processes
export const PROCESSES_ENDPOINT = 'processes';
export const PROCESS_STATUS_COUNTS_ENDPOINT = `/${PROCESSES_ENDPOINT}/status-counts`;

//settings
export const SETTINGS_ENDPOINT = '/settings';
export const SETTINGS_STATUS_ENDPOINT = `${SETTINGS_ENDPOINT}/status`;
export const SETTINGS_CACHE_NAMES_ENDPOINT = `${SETTINGS_ENDPOINT}/cache-names`;
export const SETTINGS_CACHE_ENDPOINT = `${SETTINGS_ENDPOINT}/cache`;
export const SETTINGS_SEARCH_INDEX_RESET_ENDPOINT = `${SETTINGS_ENDPOINT}/search-index/reset`;

//ipam
export const IPAM_ENDPOINT = 'surf/ipam';
export const PREFIX_FILTERS_ENDPOINT = `${IPAM_ENDPOINT}/prefix_filters`;
export const IP_BLOCKS_ENDPOINT = `${IPAM_ENDPOINT}/ip_blocks`;
export const FREE_SUBNETS_ENDPOINT = `${IPAM_ENDPOINT}/free_subnets`;
