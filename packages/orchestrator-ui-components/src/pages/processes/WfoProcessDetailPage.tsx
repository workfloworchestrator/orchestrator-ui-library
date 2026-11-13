import React, { useRef } from 'react';

import { TimelineItem, WfoError, WfoLoading, WfoStepListRef, WfoWorkflowStepList } from '@/components';
import { useGetDescriptionForWorkflowNameQuery, useGetProcessDetailQuery } from '@/rtk';
import { Step } from '@/types';
import { getProductNamesFromProcess } from '@/utils';

import { WfoProcessDetail } from './WfoProcessDetail';
import { WfoLayoutPreviewToggle, useNewUiPreview } from './layoutPreview';
import { convertStepsToGroupedSteps, mapGroupedStepsToTimelineItems } from './timelineUtils';

export type GroupedStep = {
  steps: Step[];
};

interface WfoProcessDetailPageProps {
  processId: string;
}

export const WfoProcessDetailPage = ({ processId }: WfoProcessDetailPageProps) => {
  const stepListRef = useRef<WfoStepListRef>(null);
  const { isNewUi, setNewUi } = useNewUiPreview();

  const { data, isLoading, isError } = useGetProcessDetailQuery({
    processId,
  });
  const processDetail = data?.processes[0];

  const { data: workflowMetadata, isError: isErrorWorkflowDescription } = useGetDescriptionForWorkflowNameQuery(
    {
      workflowName: processDetail?.workflowName ?? '',
    },
    {
      skip: processDetail === undefined,
    },
  );

  const steps = processDetail?.steps ?? [];

  const productNames = getProductNamesFromProcess(processDetail);
  const pageTitle = workflowMetadata?.description || (isErrorWorkflowDescription && processDetail?.workflowName) || '';
  const isTask = processDetail?.isTask ?? false;
  const groupedSteps: GroupedStep[] = convertStepsToGroupedSteps(steps);
  const timelineItems: TimelineItem[] = mapGroupedStepsToTimelineItems(groupedSteps);

  // Wait for the layout choice, so a suspended step form is not mounted twice (see layoutPreview.tsx)
  if (isNewUi === undefined) return <WfoLoading />;

  return (
    <>
      <WfoLayoutPreviewToggle isNewUi={isNewUi} onChange={setNewUi} />
      <WfoProcessDetail
        layout={isNewUi ? 'new' : 'current'}
        pageTitle={pageTitle}
        productNames={productNames}
        buttonsAreDisabled={isLoading || isError}
        processDetail={processDetail}
        timelineItems={timelineItems}
        traceback={processDetail?.traceback}
        onTimelineItemClick={(id: string) => stepListRef.current?.scrollToStep(id)}
        isLoading={isLoading}
        hasError={isError}
      >
        {(isError && <WfoError />)
          || (isLoading && <WfoLoading />)
          || (processDetail !== undefined && (
            <WfoWorkflowStepList
              ref={stepListRef}
              lastStatus={processDetail.lastStatus}
              processId={processDetail.processId}
              workflowName={processDetail.workflowName}
              steps={groupedSteps.flatMap((groupedStep) => groupedStep.steps)}
              // the new layout shows the traceback in the failure banner
              traceBack={isNewUi ? null : processDetail.traceback}
              userInputForm={processDetail.form}
              startedAt={processDetail.startedAt}
              isTask={isTask}
              userPermissions={processDetail.userPermissions}
              isNewLayout={isNewUi}
            />
          )) || <h1>Invalid processId</h1>}
      </WfoProcessDetail>
    </>
  );
};
