import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {JSONSchema6} from 'json-schema';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/router';

import {EuiFlexGroup, EuiFlexItem, EuiHorizontalRule, EuiPanel, EuiText,} from '@elastic/eui';

import {PATH_TASKS, PATH_WORKFLOWS, WfoError, WfoLoading} from '@/components';
import {useAxiosApiClient} from '@/components/WfoForms/useAxiosApiClient';
import {WfoStepStatusIcon} from '@/components/WfoWorkflowSteps';
import {getStyles} from '@/components/WfoWorkflowSteps/styles';
import {useOrchestratorTheme} from '@/hooks';
import {handlePromiseErrorWithCallback, HttpStatus, useGetTimeLineItemsQuery} from '@/rtk';
import {EngineStatus, ProcessDetail, ProcessStatus, StepStatus,} from '@/types';
import {FormNotCompleteResponse} from '@/types/forms';

// import UserInputFormWizardDeprecated from '../../components/WfoForms/UserInputFormWizardDeprecated';
import UserInputFormWizard from '@/components/WfoForms/UserInputFormWizard';
import {WfoProcessDetail} from './WfoProcessDetail';
import {useStartProcessMutation} from "@/rtk/endpoints/forms";

type StartCreateWorkflowPayload = {
    product: string;
};
type StartModifyWorkflowPayload = {
    subscription_id: string;
};

type StartWorkflowPayload =
    | StartCreateWorkflowPayload
    | StartModifyWorkflowPayload;

interface StartProcessPageQuery {
    productId?: string;
    subscriptionId?: string;
}

interface WfoStartProcessPageProps {
    processName: string;
    isTask?: boolean;
}

export interface UserInputForm {
    stepUserInput?: JSONSchema6;
    hasNext?: boolean;
}

const getInitialProcessPayload = ({
    productId,
    subscriptionId,
}: StartProcessPageQuery): StartWorkflowPayload | undefined => {
    if (productId) {
        return {
            product: productId,
        };
    }
    if (subscriptionId) {
        return {
            subscription_id: subscriptionId,
        };
    }
    return undefined;
};

export const WfoStartProcessPage = ({
    processName,
    isTask = false,
}: WfoStartProcessPageProps) => {
    const apiClient = useAxiosApiClient();
    const t = useTranslations('processes.steps');
    const router = useRouter();
    const [hasError, setHasError] = useState<boolean>(false);
    const { theme } = useOrchestratorTheme();
    const [form, setForm] = useState<UserInputForm>({});
    const { productId, subscriptionId } = router.query as StartProcessPageQuery;

    const [startProcess] = useStartProcessMutation();

    const startProcessPayload = useMemo(
        () => getInitialProcessPayload({ productId, subscriptionId }),
        [productId, subscriptionId],
    );

    const { stepUserInput, hasNext } = form;

    const { getStepHeaderStyle, stepListContentBoldTextStyle } =
        getStyles(theme);

    const {
        data: timeLineItems = [],
        isError,
        isLoading,
    } = useGetTimeLineItemsQuery(processName);

    if (isError) {
        if (!hasError) {
            setHasError(true);
        }
    }

    const submit = useCallback(
        (processInput: object[]) => {
            const startProcessPromise = startProcess({workflowName: processName, userInputs: startProcessPayload
                ? [startProcessPayload, ...processInput]
                : [...processInput]})
                .unwrap()
                .then(
                    // Resolve handler
                    (result) => {
                        const process = result as { id: string };
                        if (process.id) {
                            const basePath = isTask
                                ? PATH_TASKS
                                : PATH_WORKFLOWS;
                            router.push(`${basePath}/${process.id}`);
                        }
                    },
                    // Reject handler
                    (e) => {
                        console.log("REJECT ME IF YOU CAN", e)
                        throw e;
                    },
                )
                .catch((error) => {
                    console.log("CATCH ME IF YOU CAN", error)
                    console.log("error statys", error?.status)
                    if (error?.status !== 510) {
                        if (error?.status === 400) {
                            // Rethrow the error so userInputForm can catch it and display validation errors
                            console.log("400", error)
                            throw error;
                        }
                        console.log("510", error)
                        console.error(error);
                        setHasError(true);
                    } else {
                        console.log("CATCH ME IF YOU ELSE", error)
                        throw error;
                    }
                });

            // Catch a 503: Service unavailable error indicating the engine is down. This rethrows other errors
            // if it's not 503 so we can catch the special 510 error in the catchErrorStatus call in the useEffect hook
            return handlePromiseErrorWithCallback<EngineStatus>(
                startProcessPromise,
                503,
                (json) => {
                    // TODO: Use the toastMessage hook to display an engine down error message
                    console.error('engine down!!!', json);
                    router.push(PATH_WORKFLOWS);
                },
            );
        },
        [apiClient, processName, startProcessPayload, isTask, router],
    );

    useEffect(() => {
        if (processName) {
            const clientResultCallback = (json: FormNotCompleteResponse) => {
                setForm({
                    stepUserInput: json.form,
                    hasNext: json.hasNext ?? false,
                });
            };

            handlePromiseErrorWithCallback<FormNotCompleteResponse>(
                submit([]),
                HttpStatus.FormNotComplete,
                clientResultCallback,
            );
        }
    }, [submit, processName, apiClient]);

    const processDetail: Partial<ProcessDetail> = {
        lastStatus: ProcessStatus.CREATE,
        lastStep: StepStatus.FORM,
        workflowName: processName,
        createdBy: '-',
    };

    return (
        <WfoProcessDetail
            pageTitle={processName}
            productNames={''}
            buttonsAreDisabled={true}
            processDetail={processDetail}
            timelineItems={timeLineItems}
            isLoading={isLoading}
        >
            <EuiPanel css={{ marginTop: theme.base * 3 }}>
                <EuiFlexGroup css={getStepHeaderStyle(false)}>
                    <WfoStepStatusIcon stepStatus={StepStatus.FORM} />

                    <EuiFlexItem grow={0}>
                        <EuiText css={stepListContentBoldTextStyle}>
                            {t('userInput')}
                        </EuiText>
                        <EuiText>
                            {t(
                                isTask
                                    ? 'submitTaskFormLabel'
                                    : 'submitWorkflowFormLabel',
                            )}
                        </EuiText>
                    </EuiFlexItem>
                </EuiFlexGroup>
                <EuiHorizontalRule />
                {(hasError && <WfoError />) ||
                    (stepUserInput && (
                        <UserInputFormWizard
                            stepUserInput={stepUserInput}
                            stepSubmit={submit}
                            cancel={() =>
                                router.push(
                                    isTask ? PATH_TASKS : PATH_WORKFLOWS,
                                )
                            }
                            hasNext={hasNext}
                            isTask={isTask}
                        />
                    )) || <WfoLoading />}
            </EuiPanel>
        </WfoProcessDetail>
    );
};
