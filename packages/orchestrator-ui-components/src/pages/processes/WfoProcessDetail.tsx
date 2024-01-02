import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageHeader,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import {
    PATH_TASKS,
    PATH_WORKFLOWS,
    TimelineItem,
    WfoLoading,
    WfoTimeline,
} from '@/components';
import { ConfirmationDialogContext } from '@/contexts';
import {
    useCheckEngineStatus,
    useMutateProcess,
    useOrchestratorTheme,
} from '@/hooks';
import { WfoRefresh, WfoXCircleFill } from '@/icons';
import { ProcessDetail, ProcessStatus } from '@/types';
import { parseDateRelativeToToday, parseIsoString } from '@/utils';

import {
    RenderDirection,
    WfoProcessListSubscriptionsCell,
} from './WfoProcessListSubscriptionsCell';
import { getIndexOfCurrentStep } from './timelineUtils';

interface ProcessHeaderValueProps {
    translationKey: string;
    value: string | ProcessStatus | undefined;
}

const ProcessHeaderValue = ({
    translationKey,
    value = '',
}: ProcessHeaderValueProps) => {
    const t = useTranslations('processes.detail');
    const { theme } = useOrchestratorTheme();
    return (
        <EuiFlexGroup
            direction="column"
            gutterSize="xs"
            css={{
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }}
        >
            <EuiText size="xs">{t(translationKey)}</EuiText>
            <EuiText
                css={{
                    fontWeight: theme.font.weight.bold,
                    fontSize: theme.size.m,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {value}
            </EuiText>
        </EuiFlexGroup>
    );
};

interface ProcessDetailProps {
    pageTitle: string;
    productNames: string;
    buttonsAreDisabled: boolean;
    children: React.ReactNode;
    processDetail: Partial<ProcessDetail> | undefined;
    timelineItems: TimelineItem[];
    onTimelineItemClick?: (id: string) => void;
    isLoading?: boolean;
    hasError?: boolean;
}

export const WfoProcessDetail = ({
    children,
    processDetail,
    pageTitle,
    productNames,
    buttonsAreDisabled,
    timelineItems,
    onTimelineItemClick,
    isLoading = false,
    hasError = false,
}: ProcessDetailProps) => {
    const t = useTranslations('processes.detail');
    const { theme } = useOrchestratorTheme();
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);
    const { deleteProcess, abortProcess, retryProcess } = useMutateProcess();
    const router = useRouter();
    const { isEngineRunningNow } = useCheckEngineStatus();

    const listIncludesStatus = (
        processStatusesForDisabledState: ProcessStatus[],
        status?: string,
    ): boolean =>
        status
            ? processStatusesForDisabledState
                  .map((stat) => stat.toUpperCase())
                  .includes(status)
            : false;

    const retryButtonIsDisabled =
        buttonsAreDisabled ||
        !listIncludesStatus([ProcessStatus.FAILED], processDetail?.lastStatus);
    const abortButtonIsDisabled =
        buttonsAreDisabled ||
        listIncludesStatus(
            [ProcessStatus.COMPLETED, ProcessStatus.ABORTED],
            processDetail?.lastStatus,
        );
    const deleteButtonIsDisabled =
        buttonsAreDisabled ||
        listIncludesStatus([ProcessStatus.RUNNING], processDetail?.lastStatus);

    const processIsTask = processDetail?.isTask === true;

    const handleActionButtonClick = (action: () => void) => async () => {
        if (await isEngineRunningNow()) {
            action();
        }
    };

    const retryAction = () =>
        showConfirmDialog({
            question: t(
                processIsTask ? 'retryTaskQuestion' : 'retryWorkflowQuestion',
                {
                    workflowName: processDetail?.workflowName,
                },
            ),
            confirmAction: () => {
                processDetail?.processId &&
                    retryProcess.mutate(processDetail.processId);
            },
        });

    const abortAction = () =>
        showConfirmDialog({
            question: t(
                processIsTask ? 'abortTaskQuestion' : 'abortWorkflowQuestion',
                {
                    workflowName: processDetail?.workflowName,
                },
            ),
            confirmAction: () => {
                processDetail?.processId &&
                    abortProcess.mutate(processDetail.processId);
                router.push(processIsTask ? PATH_TASKS : PATH_WORKFLOWS);
            },
        });

    const deleteAction = () =>
        showConfirmDialog({
            question: t('deleteQuestion', {
                workflowName: processDetail?.workflowName,
            }),
            confirmAction: () => {
                processDetail?.processId &&
                    deleteProcess.mutate(processDetail.processId);
                router.push(PATH_TASKS);
            },
        });

    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiPageHeader pageTitle={pageTitle} />
                    <EuiSpacer />
                    <EuiText size="s">{productNames}</EuiText>
                </EuiFlexItem>
                <EuiFlexGroup
                    justifyContent="flexEnd"
                    direction="row"
                    css={{ flexGrow: 0 }}
                    gutterSize="s"
                >
                    <EuiButton
                        onClick={handleActionButtonClick(retryAction)}
                        iconType={() => (
                            <WfoRefresh
                                color={
                                    retryButtonIsDisabled
                                        ? theme.colors.subduedText
                                        : theme.colors.link
                                }
                            />
                        )}
                        isDisabled={retryButtonIsDisabled}
                    >
                        {t('retry')}
                    </EuiButton>
                    <EuiButton
                        onClick={handleActionButtonClick(abortAction)}
                        iconType={() => (
                            <WfoXCircleFill
                                color={
                                    abortButtonIsDisabled
                                        ? theme.colors.subduedText
                                        : theme.colors.danger
                                }
                            />
                        )}
                        color="danger"
                        isDisabled={abortButtonIsDisabled}
                    >
                        {t('abort')}
                    </EuiButton>
                    {processDetail && processIsTask && (
                        <EuiButton
                            onClick={handleActionButtonClick(deleteAction)}
                            iconType={() => (
                                <WfoXCircleFill
                                    color={
                                        deleteButtonIsDisabled
                                            ? theme.colors.subduedText
                                            : theme.colors.danger
                                    }
                                />
                            )}
                            color="danger"
                            isDisabled={deleteButtonIsDisabled}
                        >
                            {t('delete')}
                        </EuiButton>
                    )}
                </EuiFlexGroup>
            </EuiFlexGroup>
            <EuiSpacer />

            <EuiPanel
                hasShadow={false}
                hasBorder={false}
                color="subdued"
                element="div"
            >
                {(isLoading && !hasError && <WfoLoading />) ||
                    (processDetail !== undefined && (
                        <EuiFlexGroup direction="row" gutterSize="m">
                            <ProcessHeaderValue
                                translationKey="status"
                                value={processDetail.lastStatus}
                            />
                            <ProcessHeaderValue
                                translationKey="lastStep"
                                value={processDetail?.lastStep}
                            />
                            {processDetail.customer && (
                                <ProcessHeaderValue
                                    translationKey="customer"
                                    value={processDetail.customer?.fullname}
                                />
                            )}
                            <ProcessHeaderValue
                                translationKey="startedBy"
                                value={processDetail?.createdBy}
                            />
                            <ProcessHeaderValue
                                translationKey="startedOn"
                                value={
                                    processDetail?.startedAt
                                        ? parseIsoString(
                                              parseDateRelativeToToday,
                                          )(processDetail?.startedAt)
                                        : ''
                                }
                            />
                            <ProcessHeaderValue
                                translationKey="lastUpdate"
                                value={
                                    processDetail?.lastModifiedAt
                                        ? parseIsoString(
                                              parseDateRelativeToToday,
                                          )(processDetail?.lastModifiedAt)
                                        : ''
                                }
                            />
                            {process && processDetail.subscriptions && (
                                <EuiFlexGroup
                                    gutterSize="xs"
                                    direction="column"
                                    css={{
                                        flex: 1,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <EuiText size="xs">
                                        {t('relatedSubscriptions')}
                                    </EuiText>
                                    <EuiText
                                        css={{
                                            flex: 1,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontSize: theme.size.m,
                                        }}
                                    >
                                        <WfoProcessListSubscriptionsCell
                                            subscriptions={
                                                (process &&
                                                    processDetail?.subscriptions?.page.map(
                                                        (subscription) => ({
                                                            subscriptionId:
                                                                subscription.subscriptionId,
                                                            description:
                                                                subscription.description,
                                                        }),
                                                    )) ||
                                                []
                                            }
                                            renderDirection={
                                                RenderDirection.VERTICAL
                                            }
                                        />
                                    </EuiText>
                                </EuiFlexGroup>
                            )}
                        </EuiFlexGroup>
                    ))}
            </EuiPanel>
            <EuiSpacer size="s" />
            <WfoTimeline
                timelineItems={timelineItems}
                indexOfCurrentStep={getIndexOfCurrentStep(timelineItems)}
                onStepClick={(timelineItem) =>
                    onTimelineItemClick &&
                    timelineItem.id &&
                    onTimelineItemClick(timelineItem.id)
                }
            />
            {children}
        </>
    );
};
