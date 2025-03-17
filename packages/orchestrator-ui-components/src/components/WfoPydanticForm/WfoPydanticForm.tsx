import React from 'react';

import { useRouter } from 'next/router';
import { PydanticForm } from 'pydantic-forms';
import type { PydanticFormApiProvider } from 'pydantic-forms';

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { PATH_TASKS, PATH_WORKFLOWS } from '@/components';
import { StartWorkflowPayload } from '@/pages/processes/WfoStartProcessPage';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';

import { Footer } from './Footer';

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
                                const error =
                                    result.error as FetchBaseQueryError;
                                if (error.status === 510) {
                                    const data = error.data as Record<
                                        string,
                                        object | string
                                    >;
                                    resolve(data);
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
                allowUntouchedSubmit: true,
                footerRenderer: Footer,
                skipSuccessNotice: true,
            }}
        />
    );
};
