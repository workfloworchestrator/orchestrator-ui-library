import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { signOut } from 'next-auth/react';

import { OrchestratorConfigContext } from '@/contexts';
import { useWfoSession } from '@/hooks/index';

export const useMutateProcess = () => {
    const { processesEndpoint } = useContext(OrchestratorConfigContext);
    const { session } = useWfoSession();
    const queryClient = useQueryClient();

    const genericRequestHeaders = {
        authorization: session ? `Bearer ${session.accessToken}` : '',
    };

    const retryProcessRequestInit: RequestInit = {
        method: 'PUT',
        headers: {
            ...genericRequestHeaders,
            'Content-Type': 'application/json',
        },
        body: '{}',
    };

    const retryAllProcessesServiceCall = async () =>
        await fetch(`${processesEndpoint}/resume-all`, retryProcessRequestInit);

    const retryProcessServiceCall = async (id: string) =>
        await fetch(
            `${processesEndpoint}/${id}/resume`,
            retryProcessRequestInit,
        );

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

    const mutateProcesses =
        (serviceCall: () => Promise<Response>) => async () => {
            const response = await serviceCall();

            if (response.status < 200 || response.status >= 300) {
                console.error(response.status, response.body);
                if (response.status === 401 || response.status === 403) {
                    signOut();
                }
            }
        };
    const mutateProcess =
        (serviceCall: (id: string) => Promise<Response>) =>
        async (id: string) => {
            const response = await serviceCall(id);

            if (response.status < 200 || response.status >= 300) {
                console.error(response.status, response.body);
                if (response.status === 401 || response.status === 403) {
                    signOut();
                }
            }
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
