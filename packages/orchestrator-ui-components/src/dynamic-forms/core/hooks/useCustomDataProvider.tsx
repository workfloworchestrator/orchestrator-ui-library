import { FetcherResponse } from 'swr/dist/_internal';

import { IDynamicFormsLabels } from '@/dynamic-forms/types';

const useCustomDataProvider = (
    cacheKey: number,
    promiseFn?: () => FetcherResponse<IDynamicFormsLabels>,
) => {
    console.log('useCustomDataProvider', cacheKey, promiseFn);

    return {
        data: {
            custom1: 'custom1',
            custom2: 'custome2',
        },
        isLoading: false,
        isError: false,
    };
};

export default useCustomDataProvider;
