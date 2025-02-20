export const MAXIMUM_ITEMS_FOR_BULK_FETCHING = 1000;

// Graphql typically returns items paginated, this number represents "all items"
export const NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS = 1000000;

// processes
export const PROCESSES_ENDPOINT = 'processes';
export const PROCESS_STATUS_COUNTS_ENDPOINT = `${PROCESSES_ENDPOINT}/status-counts`;
export const PROCESSES_RESUME_ALL_ENDPOINT = `resume-all`;
export const PROCESS_RESUME_ENDPOINT = `resume`;
export const PROCESS_ABORT_ENDPOINT = `abort`;

//settings
export const SETTINGS_ENDPOINT = '/settings';
export const SETTINGS_ENGINE_STATUS_ENDPOINT = `${SETTINGS_ENDPOINT}/status`;
export const SETTINGS_WORKER_STATUS_ENDPOINT = `${SETTINGS_ENDPOINT}/worker-status`;
export const SETTINGS_CACHE_NAMES_ENDPOINT = `${SETTINGS_ENDPOINT}/cache-names`;
export const SETTINGS_CACHE_ENDPOINT = `${SETTINGS_ENDPOINT}/cache`;
export const SETTINGS_SEARCH_INDEX_RESET_ENDPOINT = `${SETTINGS_ENDPOINT}/search-index/reset`;
//ipam
export const IPAM_ENDPOINT = 'surf/ipam';
export const IPAM_PREFIX_FILTERS_ENDPOINT = `${IPAM_ENDPOINT}/prefix_filters`;
export const IPAM_IP_BLOCKS_ENDPOINT = `${IPAM_ENDPOINT}/ip_blocks`;
export const IPAM_FREE_SUBNETS_ENDPOINT = `${IPAM_ENDPOINT}/free_subnets`;

//subscriptions
export const SUBSCRIPTION_ACTIONS_ENDPOINT = 'subscriptions/workflows';
export const CUSTOMER_DESCRIPTION_ENDPOINT =
    '/subscription_customer_descriptions';

//metadata
export const METADATA_PRODUCT_ENDPOINT = 'products';
export const METADATA_PRODUCT_BLOCK_ENDPOINT = 'product_blocks';
export const METADATA_RESOURCE_TYPE_ENDPOINT = 'resource_types';
export const METADATA_WORKFLOWS_ENDPOINT = 'workflows';
