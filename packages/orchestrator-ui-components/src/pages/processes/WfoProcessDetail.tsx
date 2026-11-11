import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiDescriptionList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiPopover,
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
import { ProcessDetail, ProcessRetryableStatuses, ProcessStatus } from '@/types';
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
  layout = 'current',
}: ProcessDetailProps) => {
  const {
    showWorkflowUserGuide,
    expandWorkflowUserGuideOnStart,
    showWorkflowInformationLink,
    workflowInformationLinkUrl,
  } = useGetOrchestratorConfig();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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

  const actionButtons = (
    <>
      <WfoIsAllowedToRender resource={PolicyResource.PROCESS_RETRY}>
        <EuiButton
          size={buttonSize}
          onClick={handleActionButtonClick(retryAction)}
          iconType={() => <WfoRefresh color={retryButtonIsDisabled ? theme.colors.textSubdued : theme.colors.link} />}
          isDisabled={retryButtonIsDisabled}
        >
          {t('retry')}
        </EuiButton>
      </WfoIsAllowedToRender>
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
      <>
        {processDetail && processIsTask && (
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
        )}
      </>
    </>
  );

  const relatedSubscriptions =
    processDetail?.subscriptions?.page.map((subscription) => ({
      subscriptionId: subscription.subscriptionId,
      description: subscription.description,
    })) ?? [];

  if (layout === 'new') {
    const formatDate = (date?: string) => (date ? parseIsoString(parseDateRelativeToToday)(date) : '-');
    const details = [
      { title: t('lastStep'), description: processDetail?.lastStep ?? '-' },
      ...(processDetail?.customer ? [{ title: t('customer'), description: processDetail.customer.fullname }] : []),
      { title: t('startedBy'), description: processDetail?.createdBy ?? '-' },
      { title: t('startedOn'), description: formatDate(processDetail?.startedAt) },
      { title: t('lastUpdate'), description: formatDate(processDetail?.lastModifiedAt) },
      ...(isAllowed(PolicyResource.PROCESS_RELATED_SUBSCRIPTIONS) && relatedSubscriptions.length ?
        [
          {
            title: t('relatedSubscriptions'),
            description: (
              <WfoProcessListSubscriptionsCell
                subscriptions={relatedSubscriptions}
                renderDirection={RenderDirection.VERTICAL}
              />
            ),
          },
        ]
      : []),
    ];

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
                extraElement={
                  showWorkflowInformationLink && processDetail?.workflowName ?
                    <EuiToolTip content={t('openWorkflowTaskInfo')}>
                      <EuiButtonIcon
                        iconType="info"
                        iconSize="m"
                        href={workflowInformationLinkUrl + processDetail.workflowName}
                        target="_blank"
                        aria-label={t('openWorkflowTaskInfo')}
                      />
                    </EuiToolTip>
                  : undefined
                }
              />
              {/* Info line: 8px inside a group, 16px between groups, 4px under the title, 8px above the timeline */}
              <div
                css={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  columnGap: theme.size.base,
                  rowGap: theme.size.xs,
                  marginTop: theme.size.xs,
                  marginBottom: theme.size.s,
                }}
              >
                <div css={{ display: 'flex', alignItems: 'center', gap: theme.size.s, minWidth: 0 }}>
                  {processDetail?.lastStatus && <WfoProcessStatusBadge processStatus={processDetail.lastStatus} />}
                  {productNames && (
                    <EuiText size="s" color="subdued">
                      {productNames}
                    </EuiText>
                  )}
                </div>
                <EuiPopover
                  isOpen={isDetailsOpen}
                  closePopover={() => setIsDetailsOpen(false)}
                  anchorPosition="downLeft"
                  panelPaddingSize="m"
                  aria-label={t('details')}
                  button={
                    <EuiButtonEmpty
                      size="s"
                      color="text"
                      flush="both"
                      iconType={isDetailsOpen ? 'chevronSingleUp' : 'chevronSingleDown'}
                      iconSide="right"
                      onClick={() => setIsDetailsOpen((open) => !open)}
                      isLoading={isLoading && !hasError}
                    >
                      {t('details')}
                    </EuiButtonEmpty>
                  }
                >
                  <EuiDescriptionList
                    type="column"
                    compressed
                    listItems={details}
                    columnWidths={[1, 2]}
                    css={{ width: 'min(480px, 80vw)' }}
                  />
                </EuiPopover>
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
          <div css={{ minWidth: 0, gridColumn: 1, gridRow: 2 }}>{children}</div>
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
