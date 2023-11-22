import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { signOut } from 'next-auth/react';

import { OrchestratorConfigContext } from '../../contexts';
import { useSessionWithToken } from '../useSessionWithToken';

export const useMutateProcess = () => {
    const { processesEndpoint } = useContext(OrchestratorConfigContext);
    const { session } = useSessionWithToken();
    const queryClient = useQueryClient();

    const genericRequestHeaders = {
        authorization: session ? `Bearer ${session.accessToken}` : '',
    };

    const retryProcessServiceCall = async (id: string) =>
        await fetch(`${processesEndpoint}/${id}/resume`, {
            method: 'PUT',
            headers: {
                ...genericRequestHeaders,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
    const deleteProcessServiceCall = async (id: string) =>
        await fetch(`${processesEndpoint}/${id}`, {
            method: 'DELETE',
            headers: genericRequestHeaders,
        });
    const abortProcessServiceCall = async (id: string) =>
        await fetch(`${processesEndpoint}/${id}/abort`, {
            method: 'PUT',
            headers: genericRequestHeaders,
        });

    const mutateProcess = (serviceCall: (id: string) => Promise<Response>) => {
        return async (id: string) => {
            const response = await serviceCall(id);

            if (response.status < 200 || response.status >= 300) {
                console.error(response.status, response.body);
                if (response.status === 401 || response.status === 403) {
                    signOut();
                }
            }
        };
    };

    return {
        retryProcess: useMutation(mutateProcess(retryProcessServiceCall), {
            onSuccess: () => {
                queryClient.invalidateQueries('processList');
            },
        }),
        abortProcess: useMutation(mutateProcess(abortProcessServiceCall), {
            onSuccess: () => {
                queryClient.invalidateQueries('processList');
            },
        }),
        deleteProcess: useMutation(mutateProcess(deleteProcessServiceCall), {
            onSuccess: () => {
                queryClient.invalidateQueries('processList');
            },
        }),
    };
};
