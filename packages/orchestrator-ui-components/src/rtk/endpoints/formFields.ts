import {
    ImsNode,
    ImsPort,
    NodeSubscriptionOption,
    NodeSubscriptionOptionsResult,
    VlanRange,
} from '@/components';
import { ContactPerson } from '@/components/WfoForms/formFields/types';
import { NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';

const LOCATION_CODES_ENDPOINT = 'surf/crm/location_codes';
const CONTACT_PERSONS_ENDPOINT = 'surf/crm/contacts';
const IMS_NODES_ENDPOINT = '/surf/ims/nodes';
const VLANS_BY_SERVICE_PORT = 'surf/subscriptions/vlans-by-service-port';
const FREE_PORTS_BY_NODE_SUBSCRIPTION_AND_SPEED = 'surf/ims/free_ports';

const nodeSubscriptionsQuery = `query NodeSubscriptions(
    $statuses: String!
) {
    subscriptions(filterBy: [
        {field: "tag", value: "Node"},
        {field: "status", value: $statuses}

    ], first: ${NUMBER_OF_ITEMS_REPRESENTING_ALL_ITEMS}, after: 0) {
        page {
            description
            subscriptionId
        }
    }
}`;

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
        getNodeSubscriptionOptions: build.query<
            NodeSubscriptionOption[],
            { statuses: string }
        >({
            query: ({ statuses }) => ({
                document: nodeSubscriptionsQuery,
                variables: {
                    statuses,
                },
            }),
            transformResponse: (
                response: NodeSubscriptionOptionsResult,
            ): NodeSubscriptionOption[] => response?.subscriptions?.page || [],
        }),
    }),
});

export const {
    useLocationCodesQuery,
    useContactPersonsQuery,
    useImsNodesQuery,
    useVlansByServicePortQuery,
    useFreePortsByNodeSubscriptionIdAndSpeedQuery,
    useGetNodeSubscriptionOptionsQuery,
} = formFieldsApi;
