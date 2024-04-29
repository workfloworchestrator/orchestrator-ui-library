<<<<<<< Updated upstream
import { ImsNode } from '@/components';
=======
import { ImsNode, ImsPort, VlanRange } from '@/components';
>>>>>>> Stashed changes
import { ContactPerson } from '@/components/WfoForms/formFields/types';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';

const LOCATION_CODES_ENDPOINT = 'surf/crm/location_codes';
const CONTACT_PERSONS_ENDPOINT = 'surf/crm/contacts';
const IMS_NODES_ENDPOINT = '/surf/ims/nodes';
<<<<<<< Updated upstream
=======
const VLANS_BY_SERVICE_PORT = 'surf/subscriptions/vlans-by-service-port'
const FREE_PORTS_BY_NODE_SUBSCRIPTION_AND_SPEED = 'surf/ims/free_ports'
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
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
        freePortsByNodeSubscriptionIdAndSpeed: build.query<ImsPort[], { nodeSubscriptionId: string; interfaceSpeed: number, mode: string }>({
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
>>>>>>> Stashed changes
    }),
});

export const {
    useLocationCodesQuery,
    useContactPersonsQuery,
    useImsNodesQuery,
<<<<<<< Updated upstream
=======
    useVlansByServicePortQuery,
    useFreePortsByNodeSubscriptionIdAndSpeedQuery
>>>>>>> Stashed changes
} = formFieldsApi;
