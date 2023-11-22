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
    PATH_PROCESSES,
    PATH_TASKS,
    TimelineItem,
    WfoLoading,
    WfoTimeline,
} from '../../components';
import ConfirmationDialogContext from '../../contexts/ConfirmationDialogProvider';
import { useOrchestratorTheme } from '../../hooks';
import { useMutateProcess } from '../../hooks/ProcessesHooks/useMutateProcess';
import { WfoPlayFill, WfoRefresh, WfoXCircleFill } from '../../icons';
import { ProcessDetail, ProcessStatus } from '../../types';
import { parseDateRelativeToToday, parseIsoString } from '../../utils';
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
}

export const WfoProcessDetail = ({
    children,
    processDetail,
    pageTitle,
    productNames,
    buttonsAreDisabled,
    timelineItems,
    onTimelineItemClick,
}: ProcessDetailProps) => {
    const t = useTranslations('processes.detail');
    const { theme } = useOrchestratorTheme();
    const { showConfirmDialog } = useContext(ConfirmationDialogContext);
    const { deleteProcess, abortProcess, retryProcess } = useMutateProcess();
    const router = useRouter();

    const shouldBeDisabled = (
        processStatusesForDisabledState: ProcessStatus[],
        status?: string,
    ): boolean =>
        status
            ? processStatusesForDisabledState
                  .map((stat) => stat.toUpperCase())
                  .includes(status)
            : false;

    const abortButtonIsDisabled =
        buttonsAreDisabled ||
        shouldBeDisabled(
            [ProcessStatus.COMPLETED, ProcessStatus.ABORTED],
            processDetail?.lastStatus,
        );

    const deleteButtonIsDisabled =
        buttonsAreDisabled ||
        shouldBeDisabled([ProcessStatus.RUNNING], processDetail?.lastStatus);

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
                        onClick={(
                            e: React.MouseEvent<
                                HTMLButtonElement | HTMLElement,
                                MouseEvent
                            >,
                        ) => {
                            e.preventDefault();
                            showConfirmDialog({
                                question: t('retryQuestion', {
                                    workflowName: processDetail?.workflowName,
                                }),
                                confirmAction: () => {
                                    processDetail?.processId &&
                                        retryProcess.mutate(
                                            processDetail.processId,
                                        );
                                },
                            });
                        }}
                        iconType={() => (
                            <WfoRefresh
                                color={
                                    buttonsAreDisabled
                                        ? theme.colors.subduedText
                                        : theme.colors.link
                                }
                            />
                        )}
                        isDisabled={buttonsAreDisabled}
                    >
                        {t('retry')}
                    </EuiButton>
                    <EuiButton
                        onClick={(
                            e: React.MouseEvent<
                                HTMLButtonElement | HTMLElement,
                                MouseEvent
                            >,
                        ) => {
                            e.preventDefault();
                            alert('TODO: Implement resume');
                        }}
                        iconType={() => (
                            <WfoPlayFill
                                color={
                                    buttonsAreDisabled
                                        ? theme.colors.subduedText
                                        : theme.colors.link
                                }
                            />
                        )}
                        isDisabled={buttonsAreDisabled}
                    >
                        {t('resume')}
                    </EuiButton>
                    <EuiButton
                        onClick={(
                            e: React.MouseEvent<
                                HTMLButtonElement | HTMLElement,
                                MouseEvent
                            >,
                        ) => {
                            e.preventDefault();
                            showConfirmDialog({
                                question: t('abortQuestion', {
                                    workflowName: processDetail?.workflowName,
                                }),
                                confirmAction: () => {
                                    processDetail?.processId &&
                                        abortProcess.mutate(
                                            processDetail.processId,
                                        );
                                    router.push(
                                        processDetail?.isTask
                                            ? PATH_TASKS
                                            : PATH_PROCESSES,
                                    );
                                },
                            });
                        }}
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
                    {processDetail && processDetail.isTask === true && (
                        <EuiButton
                            onClick={(
                                e: React.MouseEvent<
                                    HTMLButtonElement | HTMLElement,
                                    MouseEvent
                                >,
                            ) => {
                                e.preventDefault();
                                showConfirmDialog({
                                    question: t('deleteQuestion', {
                                        workflowName:
                                            processDetail?.workflowName,
                                    }),
                                    confirmAction: () => {
                                        processDetail.processId &&
                                            deleteProcess.mutate(
                                                processDetail.processId,
                                            );
                                        router.push(PATH_TASKS);
                                    },
                                });
                            }}
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
                {(processDetail === undefined && <WfoLoading />) ||
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
