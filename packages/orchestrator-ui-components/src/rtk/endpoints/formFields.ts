import { ImsNode } from '@/components';
import { ContactPerson } from '@/components/WfoForms/formFields/types';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';

const LOCATION_CODES_ENDPOINT = 'surf/crm/location_codes';
const CONTACT_PERSONS_ENDPOINT = 'surf/crm/contacts';
const IMS_NODES_ENDPOINT = '/surf/ims/nodes';

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
    }),
});

export const {
    useLocationCodesQuery,
    useContactPersonsQuery,
    useImsNodesQuery,
} = formFieldsApi;
