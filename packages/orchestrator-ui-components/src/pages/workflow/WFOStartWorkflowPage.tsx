import React, { useState, useEffect, useCallback } from 'react';
import { JSONSchema6 } from 'json-schema';
import { useRouter } from 'next/router';

import { TimelineItem, WFOLoading } from '../../components';
import { WFOProcessDetail } from '../processes/WFOProcessDetail';
import { ProcessDetail, ProcessStatus, StepStatus } from '../../types';
import UserInputFormWizard from '../../components/WFOForms/UserInputFormWizard';
import { FormNotCompleteResponse } from '../../types/forms';
import { EngineStatus, useAxiosApiClient } from '../../hooks';
import { PATH_PROCESSES } from '../../components';

interface WFOStartWorkflowPageProps {
    workflowName: string;
    productId?: string;
    subscriptionId?: string;
}

export interface UserInputForm {
    stepUserInput?: JSONSchema6;
    hasNext?: boolean;
}

export const WFOStartWorkflowPage = ({
    workflowName,
    productId,
    subscriptionId,
}: WFOStartWorkflowPageProps) => {
    const apiClient = useAxiosApiClient();
    const router = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [form, setForm] = useState<UserInputForm>({});
    const { stepUserInput, hasNext } = form;

    const submit = useCallback(
        (processInput: object[]) => {
            if (workflowName && productId) {
                processInput.unshift({ product: productId });
            }
            if (workflowName && subscriptionId) {
                processInput.unshift({ subscription_id: subscriptionId });
            }

            const startWorkflowPromise = apiClient
                .startProcess(workflowName, processInput)
                .then(
                    // Resolve handler
                    (result) => {
                        const process = result as { id: string };
                        // TODO: Use toast hook to display success message
                        if (process.id) {
                            console.log(
                                'resolver successfullly!: ',
                                process.id,
                            );
                            router.push(`${PATH_PROCESSES}/${process.id}`);
                        }
                    },
                    // Reject handler
                    (e) => {
                        throw e;
                    },
                )
                .finally(() => {
                    setIsFetching(false);
                });

            // Catch a 503: Service unavailable error indicating the engine is down. This rethrows other errors
            // if its'  not 503 so we can catch the special 510 error in the catchErrorStatus call in the useEffect hook
            return apiClient.catchErrorStatus<EngineStatus>(
                startWorkflowPromise,
                503,
                (json) => {
                    // TODO: Use the toastMessage hook to display an engine down error message
                    console.log('engine down!!!', json);
                    router.push(PATH_PROCESSES);
                },
            );
        },
        [workflowName, productId, subscriptionId, apiClient, router],
    );

    useEffect(() => {
        if (workflowName) {
            const clientResultCallback = (json: FormNotCompleteResponse) => {
                setForm({
                    stepUserInput: json.form,
                    hasNext: json.hasNext ?? false,
                });
            };

            apiClient.catchErrorStatus<FormNotCompleteResponse>(
                submit([]),
                510,
                clientResultCallback,
            );
        }
    }, [submit, workflowName, apiClient]);

    const processDetail: Partial<ProcessDetail> = {
        lastStatus: ProcessStatus.CREATE,
        lastStep: StepStatus.FORM,
        workflowName: workflowName,
        createdBy: '-',
    };

    const fakeTimeLineItems: TimelineItem[] = [
        {
            processStepStatus: StepStatus.FORM,
        },
        {
            processStepStatus: StepStatus.PENDING,
        },
        {
            processStepStatus: StepStatus.PENDING,
        },
        {
            processStepStatus: StepStatus.PENDING,
        },
        {
            processStepStatus: StepStatus.PENDING,
        },
    ];

    return (
        <WFOProcessDetail
            pageTitle={workflowName}
            productNames={''}
            buttonsAreDisabled={true}
            isFetching={isFetching}
            processDetail={processDetail}
            timelineItems={fakeTimeLineItems}
        >
            {(stepUserInput && (
                <UserInputFormWizard
                    stepUserInput={stepUserInput}
                    validSubmit={submit}
                    cancel={() => router.push(PATH_PROCESSES)}
                    hasNext={hasNext}
                />
            )) || <WFOLoading />}
        </WFOProcessDetail>
    );
};
