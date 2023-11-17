import React, { useState, useEffect, useCallback } from 'react';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiText,
    EuiHorizontalRule,
} from '@elastic/eui';
import { JSONSchema6 } from 'json-schema';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { TimelineItem, WfoLoading } from '../../components';
import { PATH_PROCESSES } from '../../components';
import { useAxiosApiClient } from '../../components/WfoForms/useAxiosApiClient';
import UserInputFormWizard from '../../components/WfoForms/UserInputFormWizard';
import { getStyles } from '../../components/WfoWorkflowSteps/styles';
import { WfoStepStatusIcon } from '../../components/WfoWorkflowSteps/WfoStepStatusIcon';
import { EngineStatus, useOrchestratorTheme } from '../../hooks';
import { ProcessDetail, ProcessStatus, StepStatus } from '../../types';
import { FormNotCompleteResponse } from '../../types/forms';
import { WfoProcessDetail } from '../processes/WfoProcessDetail';

type StartCreateWorkflowPayload = {
    product: string;
};
type StartModifyWorkflowPayload = {
    subscription_id: string;
};

type StartWorkflowPayload =
    | StartCreateWorkflowPayload
    | StartModifyWorkflowPayload;

interface WfoStartWorkflowPageProps {
    workflowName: string;
    startWorkflowPayload?: StartWorkflowPayload;
}

export interface UserInputForm {
    stepUserInput?: JSONSchema6;
    hasNext?: boolean;
}

export const WfoStartWorkflowPage = ({
    workflowName,
    startWorkflowPayload,
}: WfoStartWorkflowPageProps) => {
    const apiClient = useAxiosApiClient();
    const t = useTranslations('processes.steps');
    const router = useRouter();
    const { theme } = useOrchestratorTheme();
    const [form, setForm] = useState<UserInputForm>({});
    const { stepUserInput, hasNext } = form;
    const { getStepHeaderStyle, stepListContentBoldTextStyle } =
        getStyles(theme);

    const submit = useCallback(
        (processInput: object[]) => {
            const startWorkflowPromise = apiClient
                .startProcess(
                    workflowName,
                    startWorkflowPayload
                        ? [startWorkflowPayload, ...processInput]
                        : [...processInput],
                )
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
                );

            // Catch a 503: Service unavailable error indicating the engine is down. This rethrows other errors
            // if it's not 503 so we can catch the special 510 error in the catchErrorStatus call in the useEffect hook
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
        [apiClient, workflowName, startWorkflowPayload, router],
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
        <WfoProcessDetail
            pageTitle={workflowName}
            productNames={''}
            buttonsAreDisabled={true}
            processDetail={processDetail}
            timelineItems={fakeTimeLineItems}
        >
            <EuiPanel css={{ marginTop: theme.base * 3 }}>
                <EuiFlexGroup css={getStepHeaderStyle(false)}>
                    <WfoStepStatusIcon stepStatus={StepStatus.FORM} />

                    <EuiFlexItem grow={0}>
                        <EuiText css={stepListContentBoldTextStyle}>
                            {t('userInput')}
                        </EuiText>
                        <EuiText>{t('submitFormLabel')}</EuiText>
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
                )) || <WfoLoading />}
            </EuiPanel>
        </WfoProcessDetail>
    );
};
