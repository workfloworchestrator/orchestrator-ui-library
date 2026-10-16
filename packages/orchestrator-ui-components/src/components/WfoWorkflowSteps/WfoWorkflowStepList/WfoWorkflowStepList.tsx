import React, { Ref, useState } from 'react';

import {
  WfoJsonCodeBlock,
  WfoLoading,
  WfoPageWithUserGuide,
  WfoStepList,
  WfoStepListHeader,
  WfoStepListRef,
} from '@/components';
import WfoDiff, { getSubscriptionDiffTexts } from '@/components/WfoDiff/WfoDiff';
import { WfoTraceback } from '@/components/WfoWorkflowSteps/WfoTraceback/WfoTraceback';
import {
  applyPresentationFloor,
  getDefaultStepPresentation,
  getNextPresentationOnClick,
} from '@/components/WfoWorkflowSteps/stepPresentationUtils';
import { useGetRawProcessDetailQuery } from '@/rtk/endpoints/processDetail';
import { ProcessStatus, Step, StepDetailLevel, StepPresentation, StepStatus } from '@/types';
import { FormUserPermissions, InputForm } from '@/types/forms';

export type StepListItem = {
  step: Step;
  stepKey: string;
  presentation: StepPresentation;
  basePresentation: StepPresentation;
  userInputForm?: InputForm;
};

export interface WfoWorkflowStepListProps {
  steps: Step[];
  lastStatus: ProcessStatus;
  traceBack: string | null;
  startedAt: string;
  processId: string;
  workflowName?: string;
  isTask: boolean;
  userInputForm?: InputForm;
  userPermissions: FormUserPermissions;
}

export const WfoProcessRawData = ({ processId }: { processId: string }) => {
  const { data, isFetching } = useGetRawProcessDetailQuery({ processId });
  return isFetching ? <WfoLoading /> : <WfoJsonCodeBlock data={data || {}} />;
};

export const WfoProcessSubscriptionDelta = ({ processId }: { processId: string }) => {
  const { data, isFetching } = useGetRawProcessDetailQuery({ processId });
  const { oldText, newText } = getSubscriptionDiffTexts(data);

  return isFetching ? <WfoLoading /> : <WfoDiff oldText={oldText} newText={newText} syntax="javascript" />;
};

export const WfoWorkflowStepList = React.forwardRef(
  (
    {
      steps = [],
      lastStatus,
      traceBack,
      processId,
      workflowName,
      isTask,
      userInputForm,
      userPermissions,
    }: WfoWorkflowStepListProps,
    reference: Ref<WfoStepListRef>,
  ) => {
    const [showHiddenKeys, setShowHiddenKeys] = useState(false);
    const [showRaw, setShowRaw] = useState(false);
    const [showDelta, setShowDelta] = useState(false);
    const [showTraceback, setShowTraceback] = useState(false);

    const [detailLevel, setDetailLevel] = useState(StepDetailLevel.STANDARD);
    // Presentations the user has chosen by clicking a step, keyed by getStepKey
    const [presentationOverrides, setPresentationOverrides] = useState<Record<string, StepPresentation>>({});

    // Steps that have not been executed yet have no stepId, so fall back to their position to keep keys unique
    const getStepKey = (step: Step, index: number) => step.stepId || `step-index-${index}`;

    // If the step is in the suspend state, we show the user input form
    const lastStepWithSuspendStatusStepId = [...steps]
      .reverse()
      .find((step) => step.status === StepStatus.SUSPEND)?.stepId;

    const stepListItems: StepListItem[] = steps.map((step, index) => {
      const stepUserInputForm =
        lastStepWithSuspendStatusStepId === step.stepId && userInputForm ? userInputForm : undefined;
      const basePresentation = applyPresentationFloor(
        getDefaultStepPresentation(step.importance, detailLevel),
        step,
        index === steps.length - 1,
        !!stepUserInputForm,
      );

      const stepKey = getStepKey(step, index);

      return {
        step,
        stepKey,
        basePresentation,
        presentation: presentationOverrides[stepKey] ?? basePresentation,
        userInputForm: stepUserInputForm,
      };
    });

    const setStepPresentation = (stepListItem: StepListItem, presentation: StepPresentation) =>
      setPresentationOverrides((previousOverrides) => ({
        ...previousOverrides,
        [stepListItem.stepKey]: presentation,
      }));

    const handleChangeDetailLevel = (newDetailLevel: StepDetailLevel) => {
      setDetailLevel(newDetailLevel);
      setPresentationOverrides({});
    };

    const toggleExpandedStateStepListItem = (stepListItem: StepListItem, canExpandToHigh: boolean) =>
      setStepPresentation(
        stepListItem,
        getNextPresentationOnClick(stepListItem.presentation, stepListItem.basePresentation, canExpandToHigh),
      );

    // Used when navigating to a step from the timeline: minimal steps become standard, others are fully expanded
    const handleExpandStepListItem = (stepListItem: StepListItem) =>
      setStepPresentation(
        stepListItem,
        stepListItem.presentation === StepPresentation.MINIMAL ? StepPresentation.STANDARD : StepPresentation.HIGH,
      );

    // The value of lastStatus is not in lowercase despite the ProcessStatus enum definition
    const isRunningWorkflow: boolean = ![ProcessStatus.FAILED, ProcessStatus.ABORTED, ProcessStatus.COMPLETED]
      .map((status) => status.toLowerCase())
      .includes(lastStatus.toLowerCase());

    return (
      <>
        <WfoStepListHeader
          showHiddenKeys={showHiddenKeys}
          showRaw={showRaw}
          showDelta={showDelta}
          showTracebackButton={traceBack !== null}
          showTraceback={showTraceback}
          detailLevel={detailLevel}
          onChangeShowHiddenKeys={setShowHiddenKeys}
          onChangeShowRaw={setShowRaw}
          onChangeShowDelta={setShowDelta}
          onChangeDetailLevel={handleChangeDetailLevel}
          onShowTraceback={setShowTraceback}
          isTask={isTask}
          isRunningWorkflow={isRunningWorkflow}
        />
        {showTraceback && <WfoTraceback>{traceBack}</WfoTraceback>}
        {showRaw && <WfoProcessRawData processId={processId} />}
        {showDelta && <WfoProcessSubscriptionDelta processId={processId} />}
        {!showRaw && !showDelta && (
          <WfoPageWithUserGuide workflowName={workflowName}>
            <WfoStepList
              ref={reference}
              stepListItems={stepListItems}
              showHiddenKeys={showHiddenKeys}
              isTask={isTask}
              onToggleExpandStepListItem={toggleExpandedStateStepListItem}
              processId={processId}
              workflowName={workflowName}
              onTriggerExpandStepListItem={handleExpandStepListItem}
              userPermissions={userPermissions}
            />
          </WfoPageWithUserGuide>
        )}
      </>
    );
  },
);

WfoWorkflowStepList.displayName = 'WfoWorkflowStepList';
