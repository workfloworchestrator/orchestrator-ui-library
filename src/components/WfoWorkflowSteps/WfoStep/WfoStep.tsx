import React, { LegacyRef, useCallback, useEffect, useRef, useState } from 'react';

import { EuiPanel } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import type { FormUserPermissions } from '@/types';
import { StepPresentation } from '@/types';

import type { StepListItem } from '../WfoWorkflowStepList';
import { getStepContent } from '../stepListUtils';
import { getWorkflowStepsStyles } from '../styles';
import { CodeView } from './WfoCodeViewSelector';
import { WfoMinimalStep } from './WfoMinimalStep';
import { WfoStepBody } from './WfoStepBody';
import { WfoStepHeader } from './WfoStepHeader';

export interface WfoStepProps {
  stepListItem: StepListItem;
  previousCreatedBy?: string;
  startedAt: string;
  completedAt: string;
  showHiddenKeys: boolean;
  hideMinimalStepName?: boolean;
  onToggleStepDetail: (canExpandToHigh: boolean) => void;
  isTask: boolean;
  isStartStep?: boolean;
  processId?: string;
  workflowName?: string;
  userPermissions: FormUserPermissions;
}

export const WfoStep = React.forwardRef(
  (
    {
      stepListItem,
      previousCreatedBy,
      onToggleStepDetail,
      startedAt,
      completedAt,
      showHiddenKeys,
      hideMinimalStepName = false,
      isStartStep = false,
      isTask,
      processId,
      userPermissions,
    }: WfoStepProps,
    ref: LegacyRef<HTMLDivElement>,
  ) => {
    const { presentation, step, userInputForm } = stepListItem;
    const isMinimal = presentation === StepPresentation.MINIMAL;
    const isExpanded = presentation === StepPresentation.HIGH;
    const [codeView, setCodeView] = useState<CodeView>(CodeView.JSON);

    const { getStepPanelStyle } = useWithOrchestratorTheme(getWorkflowStepsStyles);
    const hasHtmlMail = Object.prototype.hasOwnProperty.call(step?.stateDelta || {}, 'confirmation_mail');

    const stepContent = step.stateDelta ? getStepContent(step.stateDelta, showHiddenKeys) : {};
    const hasStepContent = hasHtmlMail || Object.keys(stepContent).length > 0;

    // A step that was expanded from minimal can always be clicked to shrink it again
    const canShrink = stepListItem.basePresentation === StepPresentation.MINIMAL;
    const isClickable = hasStepContent || canShrink;

    // Switching between minimal and the step card replaces the focused element, so focus is moved to the new one
    const toggleRef = useRef<HTMLDivElement>(null);
    const restoreFocusRef = useRef(false);

    useEffect(() => {
      if (restoreFocusRef.current) {
        restoreFocusRef.current = false;
        toggleRef.current?.focus();
      }
    }, [isMinimal]);

    const handleToggle = () => {
      restoreFocusRef.current = !!toggleRef.current && document.activeElement === toggleRef.current;
      onToggleStepDetail(hasStepContent);
    };

    const handleCodeViewChange = useCallback(
      (newCodeView: CodeView) => {
        setCodeView(newCodeView);
      },
      [setCodeView],
    );

    if (isMinimal) {
      return (
        <div ref={ref}>
          <WfoMinimalStep
            ref={toggleRef}
            step={step}
            startedAt={startedAt}
            completedAt={completedAt}
            isStartStep={isStartStep}
            hideStepName={hideMinimalStepName}
            onToggle={handleToggle}
          />
        </div>
      );
    }

    return (
      <div ref={ref}>
        <EuiPanel hasBorder={true} css={getStepPanelStyle(isClickable)}>
          <WfoStepHeader
            ref={toggleRef}
            step={step}
            previousCreatedBy={previousCreatedBy}
            startedAt={startedAt}
            completedAt={completedAt}
            isStartStep={isStartStep}
            isExpanded={isExpanded}
            isClickable={isClickable}
            hasStepContent={hasStepContent}
            showDetails={!userInputForm && !hasHtmlMail}
            codeView={codeView}
            onCodeViewChange={handleCodeViewChange}
            onToggle={handleToggle}
          />
          <WfoStepBody
            step={step}
            stepContent={stepContent}
            hasHtmlMail={hasHtmlMail}
            isExpanded={isExpanded}
            codeView={codeView}
            userInputForm={userInputForm}
            isTask={isTask}
            processId={processId}
            userPermissions={userPermissions}
          />
        </EuiPanel>
      </div>
    );
  },
);

WfoStep.displayName = 'WfoStep';
