import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiPopover,
  EuiPopoverTitle,
  EuiScreenReaderOnly,
  EuiSpacer,
  EuiText,
  EuiToolTip,
  useIsWithinBreakpoints,
} from '@elastic/eui';

import {
  PATH_TASKS,
  PATH_WORKFLOWS,
  TimelineItem,
  WfoIsAllowedToRender,
  WfoLoading,
  WfoProcessStatusBadge,
  WfoTimeline,
  WfoTitleWithWebsocketBadge,
} from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { WfoTraceback } from '@/components/WfoWorkflowSteps/WfoTraceback';
import { WfoWorkflowGuideExpandablePanel } from '@/components/WfoWorkflowUserGuide/WfoWorkflowGuideExpandablePanel';
import { PolicyResource } from '@/configuration/policy-resources';
import { ConfirmationDialogContext } from '@/contexts';
import { useCheckEngineStatus, useGetOrchestratorConfig, useOrchestratorTheme, usePolicy } from '@/hooks';
import { WfoRefresh, WfoXCircleFill } from '@/icons';
import { RenderDirection, WfoProcessListSubscriptionsCell, WfoProductInformationWithLink } from '@/pages';
import {
  useAbortProcessMutation,
  useDeleteProcessMutation,
  useRetryProcessMutation,
} from '@/rtk/endpoints/processDetail';
import { ProcessDetail, ProcessRetryableStatuses, ProcessStatus, StepStatus } from '@/types';
import { listIncludesStatus, parseDateRelativeToToday, parseIsoString } from '@/utils';

import { getIndexOfCurrentStep } from './timelineUtils';

interface ProcessHeaderValueProps {
  translationKey: string;
  value: string | ProcessStatus | undefined;
}

const ProcessHeaderValue = ({ translationKey, value = '' }: ProcessHeaderValueProps) => {
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
        size="m"
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

// Second line of the new header. Icons are decoration; the hover text (and a hidden label) names the value.
const InfoItem = ({
  icon,
  label,
  tooltip,
  children,
}: {
  icon: string;
  label: string;
  tooltip?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <EuiToolTip content={tooltip ?? label}>
    <span tabIndex={0} css={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
      <EuiIcon type={icon} size="m" color="subdued" aria-hidden />
      <EuiScreenReaderOnly>
        <span>{label}</span>
      </EuiScreenReaderOnly>
      <EuiText size="s" color="subdued">
        {children}
      </EuiText>
    </span>
  </EuiToolTip>
);

const InfoDivider = () => {
  const { theme } = useOrchestratorTheme();
  return <span aria-hidden css={{ width: 1, height: 16, background: theme.colors.borderBaseSubdued }} />;
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
  /** Full traceback text of a failed process; the new layout shows it in the failure banner */
  traceback?: string | null;
  /** 'new': sticky header with title, actions and timeline; details panel and user guide on the right */
  layout?: 'current' | 'new';
}

function useHasPreviousRoute() {
  const hasPrev = useRef(false);

  useEffect(() => {
    if (document.referrer && document.referrer !== window.location.href) {
      hasPrev.current = true;
    }
  }, []);

  return hasPrev.current;
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
  traceback,
  layout = 'current',
}: ProcessDetailProps) => {
  const tIndex = useTranslations('processes.index');
  const [isTracebackOpen, setIsTracebackOpen] = useState(false);
  const [isRelatedOpen, setIsRelatedOpen] = useState(false);
  const {
    showWorkflowUserGuide,
    expandWorkflowUserGuideOnStart,
    showWorkflowInformationLink,
    workflowInformationLinkUrl,
  } = useGetOrchestratorConfig();
  const [isGuideOpen, setIsGuideOpen] = useState(expandWorkflowUserGuideOnStart);
  const isBigScreen = useIsWithinBreakpoints(['xl', 'xxl']);
  // The sticky header's height: the user guide sticks right below it
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(() => setHeaderHeight(header.offsetHeight));
    observer.observe(header);
    return () => observer.disconnect();
  }, [layout]);
  const t = useTranslations('processes.detail');
  const { theme } = useOrchestratorTheme();
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);
  const [retryProcess] = useRetryProcessMutation();
  const [deleteProcess] = useDeleteProcessMutation();
  const [abortProcess] = useAbortProcessMutation();
  const hasPreviousRoute = useHasPreviousRoute();

  const router = useRouter();
  const { isEngineRunningNow } = useCheckEngineStatus();
  const { isAllowed } = usePolicy();

  const retryButtonIsDisabled =
    buttonsAreDisabled
    || processDetail?.userPermissions!.retryAllowed === false
    || !listIncludesStatus(ProcessRetryableStatuses, processDetail?.lastStatus);
  const abortButtonIsDisabled =
    buttonsAreDisabled
    || listIncludesStatus([ProcessStatus.COMPLETED, ProcessStatus.ABORTED], processDetail?.lastStatus);
  const deleteButtonIsDisabled =
    buttonsAreDisabled || listIncludesStatus([ProcessStatus.RUNNING], processDetail?.lastStatus);

  const processIsTask = processDetail?.isTask === true;

  const handleActionButtonClick = (action: () => void) => async () => {
    if (await isEngineRunningNow()) {
      action();
    }
  };

  const retryAction = () =>
    showConfirmDialog({
      question: t(processIsTask ? 'retryTaskQuestion' : 'retryWorkflowQuestion', {
        workflowName: processDetail?.workflowName || '',
      }),
      onConfirm: () => {
        if (processDetail?.processId) {
          retryProcess({ processId: processDetail.processId });
        }
      },
    });

  const abortAction = () =>
    showConfirmDialog({
      question: t(processIsTask ? 'abortTaskQuestion' : 'abortWorkflowQuestion', {
        workflowName: processDetail?.workflowName || '',
      }),
      onConfirm: () => {
        if (processDetail?.processId) {
          abortProcess({ processId: processDetail.processId });
        }

        if (hasPreviousRoute) {
          router.back();
        } else {
          router.push(processIsTask ? PATH_TASKS : PATH_WORKFLOWS);
        }
      },
    });

  const deleteAction = () =>
    showConfirmDialog({
      question: t('deleteQuestion', {
        workflowName: processDetail?.workflowName || '',
      }),
      onConfirm: () => {
        if (processDetail?.processId) {
          deleteProcess({ processId: processDetail.processId });
        }
        router.push(PATH_TASKS);
      },
    });

  const buttonSize = layout === 'new' ? 's' : 'm';

  // New layout: the main action sits last (right) and is filled
  const isRetryFilled = layout === 'new' && !retryButtonIsDisabled;
  const retryButton = (
    <WfoIsAllowedToRender resource={PolicyResource.PROCESS_RETRY}>
      <EuiButton
        size={buttonSize}
        fill={isRetryFilled}
        onClick={handleActionButtonClick(retryAction)}
        iconType={() => (
          <WfoRefresh
            color={
              isRetryFilled ? theme.colors.emptyShade
              : retryButtonIsDisabled ?
                theme.colors.textSubdued
              : theme.colors.link
            }
          />
        )}
        isDisabled={retryButtonIsDisabled}
      >
        {t('retry')}
      </EuiButton>
    </WfoIsAllowedToRender>
  );
  const abortButton = (
    <WfoIsAllowedToRender resource={PolicyResource.PROCESS_ABORT}>
      <EuiButton
        size={buttonSize}
        onClick={handleActionButtonClick(abortAction)}
        iconType={() => (
          <WfoXCircleFill color={abortButtonIsDisabled ? theme.colors.textSubdued : theme.colors.danger} />
        )}
        color="danger"
        isDisabled={abortButtonIsDisabled}
      >
        {t('abort')}
      </EuiButton>
    </WfoIsAllowedToRender>
  );
  const deleteButton =
    processDetail && processIsTask ?
      <WfoIsAllowedToRender resource={PolicyResource.PROCESS_DELETE}>
        <EuiButton
          size={buttonSize}
          onClick={handleActionButtonClick(deleteAction)}
          iconType={() => (
            <WfoXCircleFill color={deleteButtonIsDisabled ? theme.colors.textSubdued : theme.colors.danger} />
          )}
          color="danger"
          isDisabled={deleteButtonIsDisabled}
        >
          {t('delete')}
        </EuiButton>
      </WfoIsAllowedToRender>
    : null;

  const actionButtons =
    layout === 'new' ?
      <>
        {deleteButton}
        {abortButton}
        {retryButton}
      </>
    : <>
        {retryButton}
        {abortButton}
        {deleteButton}
      </>;

  const relatedSubscriptions =
    processDetail?.subscriptions?.page.map((subscription) => ({
      subscriptionId: subscription.subscriptionId,
      description: subscription.description,
    })) ?? [];

  if (layout === 'new') {
    const showRelated = isAllowed(PolicyResource.PROCESS_RELATED_SUBSCRIPTIONS) && relatedSubscriptions.length > 0;
    const formatDate = (date?: string) => (date ? parseIsoString(parseDateRelativeToToday)(date) : '-');
    const [firstSubscription] = relatedSubscriptions;
    const infoItems: { key: string; node: React.ReactNode }[] = [
      ...(productNames ?
        [
          {
            key: 'product',
            node: (
              <InfoItem icon="package" label={t('product')}>
                {productNames}
              </InfoItem>
            ),
          },
        ]
      : []),
      ...(processDetail?.customer ?
        [
          {
            key: 'customer',
            node: (
              <InfoItem icon="users" label={t('customer')}>
                {processDetail.customer.fullname}
              </InfoItem>
            ),
          },
        ]
      : []),
      {
        key: 'startedBy',
        node: (
          <InfoItem icon="user" label={t('startedBy')}>
            {processDetail?.createdBy ?? '-'}
          </InfoItem>
        ),
      },
      {
        key: 'dates',
        node: (
          <InfoItem
            icon="clock"
            label={t('lastUpdate')}
            tooltip={
              <>
                <div>{`${t('startedOn')}: ${formatDate(processDetail?.startedAt)}`}</div>
                <div>{`${t('lastUpdate')}: ${formatDate(processDetail?.lastModifiedAt)}`}</div>
              </>
            }
          >
            {formatDate(processDetail?.lastModifiedAt)}
          </InfoItem>
        ),
      },
      ...(showRelated ?
        [
          {
            key: 'related',
            // The most used link stays one click away; more than one: "+ N" lists them all
            node: (
              <span css={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                <EuiIcon type="link" size="m" color="subdued" aria-hidden />
                <EuiText size="s" css={{ minWidth: 0 }}>
                  <Link
                    href={`/subscriptions/${firstSubscription.subscriptionId}`}
                    css={{
                      display: 'block',
                      maxWidth: 'min(360px, 40vw)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {firstSubscription.description}
                  </Link>
                </EuiText>
                {relatedSubscriptions.length > 1 && (
                  // Click (works with keyboard and touch; a hover list would close while you move to a link)
                  <EuiPopover
                    isOpen={isRelatedOpen}
                    closePopover={() => setIsRelatedOpen(false)}
                    anchorPosition="downLeft"
                    panelPaddingSize="m"
                    aria-label={t('relatedSubscriptions')}
                    button={
                      <EuiToolTip content={tIndex('showAllRelatedSubscriptions')}>
                        <EuiButtonEmpty
                          size="xs"
                          color="primary"
                          flush="both"
                          iconType={isRelatedOpen ? 'chevronSingleUp' : 'chevronSingleDown'}
                          iconSide="right"
                          onClick={() => setIsRelatedOpen((open) => !open)}
                          aria-label={tIndex('showAllRelatedSubscriptions')}
                        >
                          {`+${relatedSubscriptions.length - 1}`}
                        </EuiButtonEmpty>
                      </EuiToolTip>
                    }
                  >
                    <EuiPopoverTitle>{`${t('relatedSubscriptions')} (${relatedSubscriptions.length})`}</EuiPopoverTitle>
                    <div css={{ maxWidth: 'min(480px, 80vw)', maxHeight: 280, overflowY: 'auto' }}>
                      <WfoProcessListSubscriptionsCell
                        subscriptions={relatedSubscriptions}
                        renderDirection={RenderDirection.VERTICAL}
                      />
                    </div>
                  </EuiPopover>
                )}
              </span>
            ),
          },
        ]
      : []),
    ];

    const failedStepIndex = timelineItems.findIndex((item) => item.processStepStatus === StepStatus.FAILED);
    const hasFailed = listIncludesStatus([ProcessStatus.FAILED], processDetail?.lastStatus) && failedStepIndex !== -1;

    // Guide open next to the content (xl+): it takes the free space, the content keeps its width
    const guideColumn = isGuideOpen && isBigScreen ? 'min(552px, 45vw)' : `${theme.base * 4 + 32}px`;

    return (
      <>
        <div
          ref={headerRef}
          css={{
            position: 'sticky',
            top: 0,
            zIndex: 3,
            background: theme.colors.backgroundBasePlain,
            padding: `${theme.size.s} 0 0`,
            marginBottom: theme.size.m,
          }}
        >
          <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" gutterSize="m" wrap responsive={false}>
            <EuiFlexItem css={{ minWidth: 0 }}>
              <WfoTitleWithWebsocketBadge
                title={pageTitle}
                // Same row, same centre line: [bolt badge] [info] | [status tag]. Info sits close to the bolt as a pair.
                extraElement={
                  <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false} css={{ marginInlineStart: -20 }}>
                    {showWorkflowInformationLink && processDetail?.workflowName && (
                      <EuiToolTip content={t('openWorkflowTaskInfo')}>
                        <EuiButtonIcon
                          size="s"
                          iconType="info"
                          iconSize="m"
                          // the bolt badge sits ~2.5px above the centre line, so the info icon follows it
                          css={{ marginBlockStart: -5 }}
                          href={workflowInformationLinkUrl + processDetail.workflowName}
                          target="_blank"
                          aria-label={t('openWorkflowTaskInfo')}
                        />
                      </EuiToolTip>
                    )}
                    {processDetail?.lastStatus && (
                      <>
                        <span aria-hidden css={{ width: 1, height: 20, background: theme.colors.borderBaseSubdued }} />
                        {/* 28px tall; the text is centred by flex, not by line-height guesses */}
                        <span
                          css={{
                            display: 'inline-flex',
                            '.euiBadge': { height: 28, padding: '0 12px', margin: 0 },
                            '.euiBadge__content, .euiBadge__text': {
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                            },
                            '.euiText': { lineHeight: 1 },
                          }}
                        >
                          <WfoProcessStatusBadge processStatus={processDetail.lastStatus} size="m" />
                        </span>
                      </>
                    )}
                  </EuiFlexGroup>
                }
              />
              {/* Info line: 12px between items, thin dividers; hover names each value. Dates: one value, both in the tooltip. */}
              <div
                css={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  columnGap: theme.size.m,
                  rowGap: theme.size.xs,
                  marginTop: theme.size.xs,
                  marginBottom: theme.size.s,
                }}
              >
                {infoItems.map((item, index) => (
                  <React.Fragment key={item.key}>
                    {index > 0 && <InfoDivider />}
                    {item.node}
                  </React.Fragment>
                ))}
              </div>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="s" wrap responsive={false}>
                {actionButtons}
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
          {timelineItems.length > 0 && (
            <WfoTimeline
              timelineItems={timelineItems}
              indexOfCurrentStep={getIndexOfCurrentStep(timelineItems)}
              // Name of the step it is on or failed on (not for a finished workflow)
              labelIndex={
                hasFailed ? failedStepIndex
                : listIncludesStatus([ProcessStatus.COMPLETED], processDetail?.lastStatus) ?
                  undefined
                : getIndexOfCurrentStep(timelineItems)
              }
              labelColor={hasFailed ? theme.colors.textDanger : theme.colors.textPrimary}
              onStepClick={(timelineItem) =>
                onTimelineItemClick && timelineItem.id && onTimelineItemClick(timelineItem.id)
              }
            />
          )}
        </div>

        <div
          css={{
            '--wfo-guide-sticky-top': `${headerHeight + 8}px`,
            display: 'grid',
            alignItems: 'start',
            // Column width is animated (not swapped), so opening the guide slides the content instead of jumping.
            // Below xl the guide stacks on top (see WfoWorkflowGuideExpandablePanel).
            gridTemplateColumns:
              isBigScreen ? `minmax(0, 1fr) ${showWorkflowUserGuide ? guideColumn : '0px'}` : 'minmax(0, 1fr)',
            transition: 'grid-template-columns 300ms cubic-bezier(0.2, 0, 0, 1)',
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        >
          <div css={{ minWidth: 0, gridColumn: 1, gridRow: 2 }}>
            {hasFailed && (
              <EuiCallOut
                color="danger"
                iconType="warning"
                size="s"
                title={t('failedAtStep', {
                  number: failedStepIndex + 1,
                  total: timelineItems.length,
                  name: String(timelineItems[failedStepIndex].stepDetail ?? ''),
                })}
                css={{ marginBottom: theme.size.xl }}
              >
                {traceback && (
                  <>
                    <EuiButtonEmpty
                      size="xs"
                      color="danger"
                      flush="left"
                      iconType={isTracebackOpen ? 'chevronSingleUp' : 'chevronSingleDown'}
                      iconSide="right"
                      onClick={() => setIsTracebackOpen((open) => !open)}
                    >
                      {t(isTracebackOpen ? 'hideTraceback' : 'showTraceback')}
                    </EuiButtonEmpty>
                    {isTracebackOpen && <WfoTraceback>{traceback}</WfoTraceback>}
                  </>
                )}
              </EuiCallOut>
            )}
            {children}
          </div>
          {showWorkflowUserGuide && (
            <div
              css={{
                gridColumn: isBigScreen ? 2 : 1,
                gridRow: isBigScreen ? 2 : 1,
                display: 'flex',
                alignSelf: 'stretch',
                paddingInlineStart: isBigScreen ? theme.size.xl : 0,
                paddingBottom: isBigScreen ? 0 : theme.size.m,
                // closed: the info strip sits at the far end; open: the guide fills the column
                justifyContent: isGuideOpen ? 'stretch' : 'flex-end',
              }}
            >
              <EuiFlexGroup gutterSize="none" css={{ position: 'relative', flexGrow: isGuideOpen ? 1 : 0 }}>
                <WfoWorkflowGuideExpandablePanel
                  workflowName={processDetail?.workflowName ?? ''}
                  isExpanded={isGuideOpen}
                  onToggle={() => setIsGuideOpen((open) => !open)}
                />
              </EuiFlexGroup>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <WfoContentHeader
        title={
          <WfoTitleWithWebsocketBadge
            title={pageTitle}
            extraElement={
              <WfoProductInformationWithLink
                productNames={productNames}
                workflowName={processDetail?.workflowName ?? ''}
              />
            }
          />
        }
      >
        {actionButtons}
      </WfoContentHeader>

      <EuiPanel hasShadow={false} hasBorder={false} color="subdued" element="div">
        {(isLoading && !hasError && <WfoLoading />)
          || (processDetail !== undefined && (
            <EuiFlexGroup direction="row" gutterSize="m">
              <ProcessHeaderValue translationKey="status" value={processDetail.lastStatus} />
              <ProcessHeaderValue translationKey="lastStep" value={processDetail?.lastStep} />
              {processDetail.customer && (
                <ProcessHeaderValue translationKey="customer" value={processDetail.customer?.fullname} />
              )}
              <ProcessHeaderValue translationKey="startedBy" value={processDetail?.createdBy} />
              <ProcessHeaderValue
                translationKey="startedOn"
                value={
                  processDetail?.startedAt ? parseIsoString(parseDateRelativeToToday)(processDetail?.startedAt) : ''
                }
              />
              <ProcessHeaderValue
                translationKey="lastUpdate"
                value={
                  processDetail?.lastModifiedAt ?
                    parseIsoString(parseDateRelativeToToday)(processDetail?.lastModifiedAt)
                  : ''
                }
              />
              {process && isAllowed(PolicyResource.PROCESS_RELATED_SUBSCRIPTIONS) && processDetail.subscriptions && (
                <EuiFlexGroup
                  gutterSize="xs"
                  direction="column"
                  css={{
                    flex: 1,
                    overflow: 'hidden',
                  }}
                >
                  <EuiText size="xs">{t('relatedSubscriptions')}</EuiText>
                  <EuiText
                    size="m"
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
                        (process
                          && processDetail?.subscriptions?.page.map((subscription) => ({
                            subscriptionId: subscription.subscriptionId,
                            description: subscription.description,
                          })))
                        || []
                      }
                      renderDirection={RenderDirection.VERTICAL}
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
        onStepClick={(timelineItem) => onTimelineItemClick && timelineItem.id && onTimelineItemClick(timelineItem.id)}
      />
      {children}
    </>
  );
};
