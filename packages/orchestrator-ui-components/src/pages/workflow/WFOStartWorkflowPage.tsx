import React, { useState, useEffect, useCallback } from 'react';
import { JSONSchema6 } from 'json-schema';
import { useRouter } from 'next/router';
import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiText,
    EuiHorizontalRule,
} from '@elastic/eui';

import { TimelineItem, WFOLoading } from '../../components';
import { WFOProcessDetail } from '../processes/WFOProcessDetail';
import { ProcessDetail, ProcessStatus, StepStatus } from '../../types';
import UserInputFormWizard from '../../components/WFOForms/UserInputFormWizard';
import { FormNotCompleteResponse } from '../../types/forms';
import {
    EngineStatus,
    useAxiosApiClient,
    useOrchestratorTheme,
} from '../../hooks';
import { PATH_PROCESSES } from '../../components';
import { getStyles } from '../../components/WFOSteps/getStyles';
import { WFOStepStatusIcon } from '../../components/WFOSteps/WFOStepStatusIcon';
import { useTranslations } from 'next-intl';

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
    const t = useTranslations('processes.steps');
    const router = useRouter();
    const { theme } = useOrchestratorTheme();
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [form, setForm] = useState<UserInputForm>({});
    const { stepUserInput, hasNext } = form;
    const { stepHeaderStyle, stepListContentBoldTextStyle } = getStyles(theme);

    const addParamsToProcessInput = (processInput: object[]): object[] => {
        if (workflowName && productId) {
            return [{ product: productId }, ...processInput];
        } else if (workflowName && subscriptionId) {
            return [{ subscription_id: subscriptionId }, ...processInput];
        } else {
            return processInput;
        }
        return processInput;
    };

    const submit = useCallback(
        (processInput: object[]) => {
            const input = addParamsToProcessInput(processInput);

            const startWorkflowPromise = apiClient
                .startProcess(workflowName, input)
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
            <EuiPanel css={{ marginTop: theme.base * 3 }}>
                <EuiFlexGroup css={stepHeaderStyle}>
                    <WFOStepStatusIcon stepStatus={StepStatus.FORM} />

                    <EuiFlexItem grow={0}>
                        <EuiText css={stepListContentBoldTextStyle}>
                            {t('userInput')}
                        </EuiText>
                        <EuiText>{t('inProgress')}</EuiText>
                    </EuiFlexItem>
                </EuiFlexGroup>
                <EuiHorizontalRule />
                {(stepUserInput && (
                    <UserInputFormWizard
                        stepUserInput={stepUserInput}
                        validSubmit={submit}
                        cancel={() => router.push(PATH_PROCESSES)}
                        hasNext={hasNext}
                    />
                )) || <WFOLoading />}
            </EuiPanel>
        </WFOProcessDetail>
    );
};
