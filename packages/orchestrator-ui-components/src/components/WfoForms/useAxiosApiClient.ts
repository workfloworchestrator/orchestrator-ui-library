import { useContext } from 'react';

import { ApiClientContext } from '@/contexts';

export const useAxiosApiClient = () => {
    const { apiClient } = useContext(ApiClientContext);
    return apiClient;
};
