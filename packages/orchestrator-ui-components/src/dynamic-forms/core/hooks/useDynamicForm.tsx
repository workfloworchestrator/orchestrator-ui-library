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
import { useState } from 'react';

import {
    DynamicFormsMetaData,
    IDynamicFormApiErrorResponse,
    IDynamicFormApiResponse,
    IValidationErrorDetails,
} from '@/dynamic-forms/types';
import { HttpStatus } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';

import { getErrorDetailsFromResponse } from '../helper';

interface UseDynamicFormResponse {
    formSchema?: IDynamicFormApiResponse;
    workflowResult?: { id: string };
    isLoading?: boolean;
    hasUnexpectedError?: boolean;
    validationErrors?: IValidationErrorDetails;
}

export function useDynamicForm(
    workflowName: string,
    userInputs: DynamicFormsMetaData[],
): UseDynamicFormResponse {
    const [startProcess] = useStartProcessMutation();
    const [hasUnexpectedError, setHasUnexpectedError] =
        useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [formSchema, setFormSchema] = useState<IDynamicFormApiResponse>();
    const [workflowResult, setWorkflowResult] =
        useState<UseDynamicFormResponse['workflowResult']>();
    const [validationErrors, setValidationErrors] =
        useState<IValidationErrorDetails>();

    1 === 2 &&
        startProcess({
            workflowName,
            userInputs,
        })
            .unwrap()
            .then((result) => {
                console.log(result);
                setWorkflowResult(result);
                // TODO: Trigger success handler
            })
            .catch(
                (error: {
                    status: HttpStatus;
                    data: IDynamicFormApiErrorResponse;
                }) => {
                    console.log('error', error);

                    /*
                    const { status, data } = error;
                    if (
                        status === HttpStatus.BadRequest &&
                        data.validation_errors
                    ) {
                        // Form has validation errors
                        setValidationErrors(getErrorDetailsFromResponse(data));
                        console.log(
                            'Validation errors',
                            data.validation_errors,
                        );
                    } else if (status === HttpStatus.FormNotComplete) {
                        console.log('Form not complete hahahha', error);
                        setFormSchema(data.form);
                        setHasUnexpectedError(false);
                    } else {
                        console.log('Unexpected error', error);
                        setHasUnexpectedError(true);
                    }*/
                },
            )
            .finally(() => {
                setIsLoading(false);
            });

    console.log('formSchema', formSchema);
    return {
        formSchema,
        workflowResult,
        isLoading,
        hasUnexpectedError,
        validationErrors,
    };
}
