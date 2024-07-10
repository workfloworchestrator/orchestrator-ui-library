/* eslint-disable @typescript-eslint/no-explicit-any */
import { isError } from 'lodash';

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
export function useLabelProvider(workflowName: string, cacheKey?: number) {
    return {
        formLabels: {
            label1: 'label1',
            label2: 'label2',
        },
        isLoadingFormLabels: false,
        hasErrorFormLabels: false,
    };
}
