import React, { useState, useEffect, useCallback } from 'react';
import { JSONSchema6 } from 'json-schema';
import { redirect } from 'next/navigation';

import { TimelineItem, WFOLoading } from '../../components';
import { WFOProcessDetail } from '../processes/WFOProcessDetail';
import { ProcessDetail, ProcessStatus, StepStatus } from '../../types';
import UserInputFormWizard from '../../components/WFOForms/UserInputFormWizard';
import { FormNotCompleteResponse } from '../../types/forms';
import { EngineStatus, useAxiosApiClient } from '../../hooks';

interface WFOStartWorkflowPageProps {
    workflowName: string;
    productId: string;
}

export interface UserInputForm {
    stepUserInput?: JSONSchema6;
    hasNext?: boolean;
}

export const WFOStartWorkflowPage = ({
    workflowName,
    productId,
}: WFOStartWorkflowPageProps) => {
    const apiClient = useAxiosApiClient();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [form, setForm] = useState<UserInputForm>({});
    const { stepUserInput, hasNext } = form;

    const submit = useCallback(
        (processInput: object[]) => {
            if (workflowName && productId) {
                processInput.unshift({ product: productId });
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
                            redirect(`/processes/${process.id}`);
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
                    redirect('/processes');
                },
            );
        },
        [workflowName, productId, apiClient],
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
                    cancel={() => redirect('/processes')}
                    hasNext={hasNext}
                />
            )) || <WFOLoading />}
        </WFOProcessDetail>
    );
};
