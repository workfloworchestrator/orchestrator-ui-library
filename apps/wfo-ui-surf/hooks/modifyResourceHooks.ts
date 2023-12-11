import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { useSessionWithToken } from '@orchestrator-ui/orchestrator-ui-components';

import {
    ACCEPT_IMPACT_ENDPOINT,
    CIM_TICKETS_ENDPOINT,
    PATCH_IMPACT_OVERRIDE_ENDPOINT,
} from '@/constants-surf';
import { SurfConfigContext } from '@/contexts/SurfConfigContext';
import { ImpactLevel } from '@/types';

export interface PatchImpactOverridePayload {
    impact_override: ImpactLevel;
    serviceTicketId: string;
    index: number;
}

export interface AcceptImpactPayload {
    serviceTicketId: string;
}

const useCimSettings = () => {
    const queryClient = useQueryClient();
    const { session } = useSessionWithToken();
    const { cimApiBaseUrl } = useContext(SurfConfigContext);
    let requestHeaders = {};

    if (session) {
        const { accessToken } = session;

        requestHeaders = {
            Authorization: `Bearer ${accessToken}`,
        };
    }
    return {
        queryClient,
        cimApiBaseUrl,
        requestHeaders,
    };
};

export const usePatchImpactedObject = () => {
    const { queryClient, cimApiBaseUrl, requestHeaders } = useCimSettings();

    let serviceTicketId = '';
    const mutate = async (payload: PatchImpactOverridePayload) => {
        serviceTicketId = payload.serviceTicketId;

        const data = {
            impact_override: payload.impact_override,
        };

        console.log('CIM API BASE URL: ', cimApiBaseUrl);

        const response = await fetch(
            cimApiBaseUrl +
                PATCH_IMPACT_OVERRIDE_ENDPOINT +
                serviceTicketId +
                '/' +
                payload.index,
            {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    ...requestHeaders,
                },
            },
        );
        return await response.json();
    };

    return useMutation(mutate, {
        onMutate: () => {
            queryClient.setQueryData(['serviceTickets', serviceTicketId], null); // Set loading state of the button
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['serviceTickets', serviceTicketId]);
        },
    });
};

export const useAcceptImpact = () => {
    const { queryClient, cimApiBaseUrl, requestHeaders } = useCimSettings();

    let serviceTicketId = '';
    const mutate = async (payload: AcceptImpactPayload) => {
        serviceTicketId = payload.serviceTicketId;

        const data = {};

        const response = await fetch(
            `${cimApiBaseUrl}${CIM_TICKETS_ENDPOINT}${serviceTicketId}${ACCEPT_IMPACT_ENDPOINT}`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    ...requestHeaders,
                },
            },
        );
        return await response.json();
    };

    return useMutation(mutate, {
        onMutate: () => {
            queryClient.setQueryData(['serviceTickets', serviceTicketId], null); // Set loading state of the button
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['serviceTickets', serviceTicketId]);
            queryClient.invalidateQueries(['serviceTickets']);
        },
    });
};
