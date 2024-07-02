/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Dynamic Forms
 *
 * SWR Hook to fetch the JSON Schema from the backend.
 * In this hook we also POST the form data when its available.
 *
 * Anytime the formKey, formInputData, metaData or swrConfig changes,
 * we call the API again.
 *
 * In this hook we make an API call, ignore 510 and 400 responses
 * and type the response to the expected format
 *
 * Disabled revalidate / refresh system of SWR, this would cause submissions
 */
import useSWR from 'swr';

import {
    DfFormProvider,
    DynamicFormsMetaData,
    IDynamicFormApiErrorResponse,
} from '@/types';

export function useDynamicForm(
    formKey: string,
    formInputData: DynamicFormsMetaData,
    formProvider: DfFormProvider,
    tmp_pydanticFormsOriginalImplementation: boolean,
    metaData?: DynamicFormsMetaData,
    cacheKey?: number,
) {
    return useSWR<IDynamicFormApiErrorResponse>(
        // cache key
        [formKey, formInputData, metaData, cacheKey],

        // return val
        async ([formKey, formInputData, metaData]) => {
            let requestBody: object | unknown = {};

            if (tmp_pydanticFormsOriginalImplementation) {
                requestBody = formInputData;
            } else {
                requestBody = {
                    form_input_data: formInputData,
                    meta_data: metaData,
                };
            }
            const ogreq = (await formProvider({
                formKey,
                requestBody,
            })) as any;

            if (
                Object.keys(ogreq).length === 0 ||
                (!ogreq.validation_errors && !ogreq.form)
            ) {
                return {
                    success: true,
                };
            }

            return ogreq;
        },

        // swr config
        {
            fallback: {},

            // we dont want to refresh the form structure automatically
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
            keepPreviousData: true,
            shouldRetryOnError: false,
        },
    );
}
