import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { JSONSchema6 } from 'json-schema';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { PydanticForm } from 'pydantic-forms';
import type { PydanticFormApiProvider } from 'pydantic-forms';

import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiHorizontalRule,
    EuiPanel,
    EuiText,
} from '@elastic/eui';

import { PATH_TASKS, PATH_WORKFLOWS, WfoError, WfoLoading } from '@/components';
import { UserInputFormWizard } from '@/components/WfoForms/UserInputFormWizard';
import { WfoStepStatusIcon } from '@/components/WfoWorkflowSteps';
import { getStyles } from '@/components/WfoWorkflowSteps/styles';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import {
    HttpStatus,
    handlePromiseErrorWithCallback,
    useGetDescriptionForWorkflowNameQuery,
    useGetTimeLineItemsQuery,
} from '@/rtk';
import { useGetSubscriptionDetailQuery } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import {
    EngineStatus,
    ProcessDetail,
    ProcessStatus,
    StepStatus,
} from '@/types';
import { FormNotCompleteResponse } from '@/types/forms';

import { WfoProcessDetail } from './WfoProcessDetail';

type PreselectedInput = {
    prefix?: string;
    prefixlen?: string;
};

type StartCreateWorkflowPayload = {
    product: string;
} & PreselectedInput;

type StartModifyWorkflowPayload = {
    subscription_id: string;
};

type StartWorkflowPayload =
    | StartCreateWorkflowPayload
    | StartModifyWorkflowPayload;

type StartProcessPageQuery = {
    productId?: string;
    subscriptionId?: string;
} & PreselectedInput;

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
    if (subscriptionId) {
        return {
            subscription_id: subscriptionId,
        };
    } else if (productId) {
        return {
            product: productId,
        };
    }
    return undefined;
};

export const WfoStartProcessPage = ({
    processName,
    isTask = false,
}: WfoStartProcessPageProps) => {
    const t = useTranslations('processes.steps');
    const router = useRouter();
    const [hasError, setHasError] = useState<boolean>(false);
    const { theme } = useOrchestratorTheme();
    const [form, setForm] = useState<UserInputForm>({});
    const { productId, subscriptionId } = router.query as StartProcessPageQuery;

    const {
        data: subscriptionDetail,
        isLoading: isLoadingSubscriptionDetail,
        isError: isErrorSubscriptionDetail,
    } = useGetSubscriptionDetailQuery(
        {
            subscriptionId: subscriptionId || '',
        },
        { skip: !subscriptionId },
    );

    const { data: workflowMetadata, isError: isErrorWorkflowDescription } =
        useGetDescriptionForWorkflowNameQuery({
            workflowName: processName,
        });

    const [startProcess] = useStartProcessMutation();

    const startProcessPayload = useMemo(
        () =>
            getInitialProcessPayload({
                productId,
                subscriptionId,
            }),
        [productId, subscriptionId],
    );

    const { stepUserInput, hasNext } = form;

    const { getStepHeaderStyle, stepListContentBoldTextStyle } =
        useWithOrchestratorTheme(getStyles);

    const {
        data: timeLineItems = [],
        isError: isErrorTimeLineItems,
        isLoading: isLoadingTimeLineItems,
    } = useGetTimeLineItemsQuery(processName);

    const isLoading = isLoadingSubscriptionDetail || isLoadingTimeLineItems;
    const isError = isErrorSubscriptionDetail || isErrorTimeLineItems;

    if (isError) {
        if (!hasError) {
            setHasError(true);
        }
    }

    const submit = useCallback(
        (processInput: object[]) => {
            const startProcessPromise = startProcess({
                workflowName: processName,
                userInputs: startProcessPayload
                    ? [startProcessPayload, ...processInput]
                    : [...processInput],
            })
                .unwrap()
                .then(
                    (process) => {
                        if (process.id) {
                            const basePath = isTask
                                ? PATH_TASKS
                                : PATH_WORKFLOWS;
                            router.replace(`${basePath}/${process.id}`);
                        }
                    },
                    // Reject handler
                    (e) => {
                        throw e;
                    },
                )
                .catch((error) => {
                    if (error?.status !== HttpStatus.FormNotComplete) {
                        if (error?.status === HttpStatus.BadRequest) {
                            // Rethrow the error so userInputForm can catch it and display validation errors
                            throw error;
                        }
                        console.error(error);
                        setHasError(true);
                    } else {
                        throw error;
                    }
                });

            // Catch a 503: Service unavailable error indicating the engine is down. This rethrows other errors
            // if it's not 503 so we can catch the special 510 error in the catchErrorStatus call in the useEffect hook
            return handlePromiseErrorWithCallback<EngineStatus>(
                startProcessPromise,
                HttpStatus.ServiceUnavailable,
                (json) => {
                    // TODO: Use the toastMessage hook to display an engine down error message
                    console.error('engine down!!!', json);
                    router.push(PATH_WORKFLOWS);
                },
            );
        },
        [startProcess, processName, startProcessPayload, isTask, router],
    );

    useEffect(() => {
        if (processName && processName !== 'modify_note') {
            const clientResultCallback = (json: FormNotCompleteResponse) => {
                setForm({
                    stepUserInput: json.form,
                    hasNext: json.meta?.hasNext ?? false,
                });
            };
            handlePromiseErrorWithCallback<FormNotCompleteResponse>(
                submit([]),
                HttpStatus.FormNotComplete,
                clientResultCallback,
            );
            return () => {
                setForm({});
            };
        }
    }, [submit, processName]);

    const processDetail: Partial<ProcessDetail> = {
        lastStatus: ProcessStatus.CREATE,
        lastStep: StepStatus.FORM,
        workflowName: processName,
        createdBy: '-',
        subscriptions: subscriptionDetail && {
            page: [
                {
                    product: {
                        name: subscriptionDetail.subscription.product.name,
                    },
                    description: subscriptionDetail.subscription.description,
                    subscriptionId:
                        subscriptionDetail.subscription.subscriptionId,
                },
            ],
        },
    };

    const pageTitle =
        workflowMetadata?.description ||
        (isErrorWorkflowDescription && processDetail?.workflowName) ||
        '';

    const getPydanticFormProvider = () => {
        const subscriptionIdInput = { subscription_id: subscriptionId };

        const pydanticFormProvider: PydanticFormApiProvider = async ({
            requestBody = [],
            formKey,
        }: {
            requestBody: object[];
            formKey: string;
        }) => {
            const response = startProcess({
                workflowName: formKey,
                userInputs: [subscriptionIdInput, ...requestBody],
            });
            return response
                .then((result) => {
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

    return (
        <WfoProcessDetail
            pageTitle={pageTitle}
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
                    (processName === 'modify_note' && (
                        <PydanticForm
                            id="modify_note"
                            // @ts-expect-error: TEMP FIX
                            onSuccess={(a, b, { response }) => {
                                if (response?.id) {
                                    const pfBasePath = isTask
                                        ? PATH_TASKS
                                        : PATH_WORKFLOWS;
                                    router.replace(
                                        `${pfBasePath}/${response.id}`,
                                    );
                                }
                            }}
                            config={{
                                apiProvider: getPydanticFormProvider(),
                            }}
                        />
                    )) ||
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
