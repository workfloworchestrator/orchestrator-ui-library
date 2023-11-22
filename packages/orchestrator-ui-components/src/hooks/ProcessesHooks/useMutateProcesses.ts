import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { signOut } from 'next-auth/react';

import { OrchestratorConfigContext } from '../../contexts';
import { useSessionWithToken } from '../useSessionWithToken';

export const useMutateProcesses = () => {
    const { processesEndpoint } = useContext(OrchestratorConfigContext);
    const { session } = useSessionWithToken();
    const queryClient = useQueryClient();

    const genericRequestHeaders = {
        authorization: session ? `Bearer ${session.accessToken}` : '',
    };

    const retryAllProcessesServiceCall = async () =>
        await fetch(`${processesEndpoint}/resume-all`, {
            method: 'PUT',
            headers: {
                ...genericRequestHeaders,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

    const mutateProcesses = (serviceCall: () => Promise<Response>) => {
        return async () => {
            const response = await serviceCall();

            if (response.status < 200 || response.status >= 300) {
                console.error(response.status, response.body);
                if (response.status === 401 || response.status === 403) {
                    signOut();
                }
            }
        };
    };

    return {
        retryAllProcesses: useMutation(
            mutateProcesses(retryAllProcessesServiceCall),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('processList');
                },
            },
        ),
    };
};
