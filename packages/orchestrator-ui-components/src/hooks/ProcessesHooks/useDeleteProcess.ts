import { useContext } from 'react';
import { OrchestratorConfigContext } from '../../contexts';
import { useSessionWithToken } from '../useSessionWithToken';
import { signOut } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';

export const useDeleteProcess = () => {
    const { processesEndpoint } = useContext(OrchestratorConfigContext);
    const { session } = useSessionWithToken();
    const queryClient = useQueryClient();

    const requestHeaders = {
        authorization: session ? `Bearer ${session.accessToken}` : '',
    };

    const deleteProcess = async (id: string) => {
        const response = await fetch(`${processesEndpoint}/${id}`, {
            method: 'DELETE',
            headers: requestHeaders,
        });

        if (response.status < 200 || response.status >= 300) {
            console.error(response.status, response.body);
            if (response.status === 401 || response.status === 403) {
                signOut();
            }
        }
    };

    return useMutation(deleteProcess, {
        onSuccess: () => {
            queryClient.invalidateQueries('processList');
        },
    });
};
