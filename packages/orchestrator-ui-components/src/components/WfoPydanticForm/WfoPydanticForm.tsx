import React from 'react';

import { useRouter } from 'next/router';
import { PydanticForm } from 'pydantic-forms';
import type { PydanticFormApiProvider } from 'pydantic-forms';

import { PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import { StartWorkflowPayload } from '@/pages/processes/WfoStartProcessPage';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';

interface WfoPydanticFormProps {
    processName: string;
    startProcessPayload: StartWorkflowPayload;
    isTask?: boolean;
}

export const WfoPydanticForm = ({
    processName,
    startProcessPayload,
    isTask,
}: WfoPydanticFormProps) => {
    const [startProcess] = useStartProcessMutation();
    const router = useRouter();

    const getPydanticFormProvider = () => {
        const pydanticFormProvider: PydanticFormApiProvider = async ({
            requestBody = [],
            formKey,
        }) => {
            const response = startProcess({
                workflowName: formKey,
                userInputs: [{ ...startProcessPayload }, ...requestBody],
            });
            return response
                .then((result) => {
                    console.log('resulting', result);

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return new Promise<Record<string, any>>((resolve) => {
                        if (result.error) {
                            // @ts-expect-error: TEMP FIX
                            if (result.error.status === 510) {
                                // @ts-expect-error: TEMP FIX
                                resolve(result.error.data);
                            }
                        } else if (result.data) {
                            resolve(result.data);
                        }

                        resolve({});
                    });
                })
                .catch((error) => {
                    console.log('catching', error);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return new Promise<Record<string, any>>(
                        (resolve, reject) => {
                            if (error.status === 510) {
                                resolve(error.data);
                            }
                            reject(error);
                        },
                    );
                });
        };

        return pydanticFormProvider;
    };

    console.log(processName, startProcessPayload, isTask);

    const onSuccess = (fieldValues, result) => {
        // console.log('onSuccess', fieldValues, response);
        const response = result ? result?.response : null;
        if (response?.id) {
            const pfBasePath = isTask ? PATH_TASKS : PATH_WORKFLOWS;
            router.replace(`${pfBasePath}/${response.id}`);
        }
    };

    return (
        <PydanticForm
            id={processName}
            onSuccess={onSuccess}
            config={{
                apiProvider: getPydanticFormProvider(),
            }}
        />
    );
};
