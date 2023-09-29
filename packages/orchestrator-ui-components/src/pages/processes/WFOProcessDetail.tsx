import React from 'react';
import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageHeader,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { useTranslations } from 'next-intl';

import { TimelineItem, WFOLoading, WFOTimeline } from '../../components';
import {
    WFOProcessListSubscriptionsCell,
    RenderDirection,
} from './WFOProcessListSubscriptionsCell';
import { useOrchestratorTheme } from '../../hooks';
import { ProcessDetail, ProcessStatus } from '../../types';
import { parseDateRelativeToToday, parseIsoString } from '../../utils';
import { getIndexOfCurrentStep } from './timelineUtils';
import { WFOPlayFill, WFORefresh, WFOXCircleFill } from '../../icons';

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
    isFetching: boolean;
    children: React.ReactNode;
    processDetail: Partial<ProcessDetail> | undefined;
    timelineItems: TimelineItem[];
    onTimelineItemClick?: (id: string) => void;
}

export const WFOProcessDetail = ({
    children,
    processDetail,
    pageTitle,
    productNames,
    buttonsAreDisabled,
    timelineItems,
    isFetching,
    onTimelineItemClick,
}: ProcessDetailProps) => {
    const t = useTranslations('processes.detail');
    const { theme } = useOrchestratorTheme();
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
                            alert('TODO: Implement retry');
                        }}
                        iconType={() => (
                            <WFORefresh
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
                            <WFOPlayFill
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
                            alert('TODO: Implement abort');
                        }}
                        iconType={() => (
                            <WFOXCircleFill
                                color={
                                    buttonsAreDisabled
                                        ? theme.colors.subduedText
                                        : theme.colors.danger
                                }
                            />
                        )}
                        color="danger"
                        isDisabled={buttonsAreDisabled}
                    >
                        {t('abort')}
                    </EuiButton>
                </EuiFlexGroup>
            </EuiFlexGroup>
            <EuiSpacer />

            <EuiPanel
                hasShadow={false}
                hasBorder={false}
                color="subdued"
                element="div"
            >
                {(isFetching && processDetail === undefined && (
                    <WFOLoading />
                )) ||
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
                                        <WFOProcessListSubscriptionsCell
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
            <WFOTimeline
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
