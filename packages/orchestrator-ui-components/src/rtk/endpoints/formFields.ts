import { ImsNode, ImsPort, NodeSubscription, VlanRange } from '@/components';
import { ContactPerson } from '@/components/WfoForms/formFields/types';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';

const LOCATION_CODES_ENDPOINT = 'surf/crm/location_codes';
const CONTACT_PERSONS_ENDPOINT = 'surf/crm/contacts';
const IMS_NODES_ENDPOINT = '/surf/ims/nodes';
const VLANS_BY_SERVICE_PORT = 'surf/subscriptions/vlans-by-service-port';
const FREE_PORTS_BY_NODE_SUBSCRIPTION_AND_SPEED = 'surf/ims/free_ports';
const SUBSCRIPTIONS = 'subscriptions';

export const subscriptionsParams = (
    tagList: string[] = [],
    statusList: string[] = [],
    productList: string[] = [],
): string => {
    const filters = [];

    if (tagList.length)
        filters.push(`tags,${encodeURIComponent(tagList.join('-'))}`);
    if (statusList.length)
        filters.push(`statuses,${encodeURIComponent(statusList.join('-'))}`);
    if (productList.length)
        filters.push(`products,${encodeURIComponent(productList.join('-'))}`);

    const params = new URLSearchParams();
    if (filters.length) params.set('filter', filters.join(','));

    return `${filters.length ? '?' : ''}${params.toString()}`;
};

export const nodeSubscriptions = (statusList: string[] = []): string => {
    return subscriptionsParams(['Node'], statusList);
};

const formFieldsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        locationCodes: build.query<string[], void>({
            query: () => ({
                url: `${LOCATION_CODES_ENDPOINT}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        contactPersons: build.query<
            ContactPerson[],
            { customerIdValue: string }
        >({
            query: ({ customerIdValue }) => ({
                url: `${CONTACT_PERSONS_ENDPOINT}/${customerIdValue}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        imsNodes: build.query<
            ImsNode[],
            { locationCode: string; status: string; unsubscribedOnly: boolean }
        >({
            query: ({ locationCode, status, unsubscribedOnly }) => ({
                url: `${IMS_NODES_ENDPOINT}/${locationCode}/${status}?unsubscribed_only=${unsubscribedOnly}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        vlansByServicePort: build.query<
            VlanRange[],
            { subscriptionId: string; nsiVlansOnly: boolean }
        >({
            query: ({ subscriptionId, nsiVlansOnly }) => ({
                url: `${VLANS_BY_SERVICE_PORT}/${subscriptionId}?nsi_vlans_only=${nsiVlansOnly}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        freePortsByNodeSubscriptionIdAndSpeed: build.query<
            ImsPort[],
            { nodeSubscriptionId: string; interfaceSpeed: number; mode: string }
        >({
            query: ({ nodeSubscriptionId, interfaceSpeed, mode }) => ({
                url: `${FREE_PORTS_BY_NODE_SUBSCRIPTION_AND_SPEED}/${nodeSubscriptionId}/${interfaceSpeed}/${mode}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
        subscriptionsWithFilters: build.query<
            NodeSubscription[],
            { filters: string }
        >({
            query: ({ filters }) => ({
                url: `${SUBSCRIPTIONS}/${filters}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
            },
        }),
    }),
});

export const {
    useLocationCodesQuery,
    useContactPersonsQuery,
    useImsNodesQuery,
    useVlansByServicePortQuery,
    useFreePortsByNodeSubscriptionIdAndSpeedQuery,
    useSubscriptionsWithFiltersQuery,
} = formFieldsApi;
