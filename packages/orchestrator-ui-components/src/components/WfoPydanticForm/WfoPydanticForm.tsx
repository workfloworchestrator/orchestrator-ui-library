import React from 'react';

import { useRouter } from 'next/router';
import { PydanticForm } from 'pydantic-forms';
import type { PydanticFormApiProvider } from 'pydantic-forms';

import { PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import { StartWorkflowPayload } from '@/pages/processes/WfoStartProcessPage';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';

interface WfoPydanticFormProps {
    processName: string;
    startProcessPayload?: StartWorkflowPayload;
    isTask?: boolean;
}

interface StartProcessResponse {
    id: string;
}

export const WfoPydanticForm = ({
    processName,
    startProcessPayload,
    isTask,
}: WfoPydanticFormProps) => {
    const [startProcess] = useStartProcessMutation();
    const router = useRouter();

    const onSuccess = (_fieldValues: object, req: object) => {
        const request = req as { response: StartProcessResponse };
        const response = request ? request?.response : null;
        if (response?.id) {
            const pfBasePath = isTask ? PATH_TASKS : PATH_WORKFLOWS;
            router.replace(`${pfBasePath}/${response.id}`);
        }
    };

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
                    return new Promise<Record<string, object | string>>(
                        (resolve) => {
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
                        },
                    );
                })
                .catch((error) => {
                    return new Promise<Record<string, object>>(
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
