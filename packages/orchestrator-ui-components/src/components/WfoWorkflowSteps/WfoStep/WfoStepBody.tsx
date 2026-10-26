import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { WfoJsonCodeBlock, WfoMonacoCodeBlock, WfoTableCodeBlock } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import type { EmailState, FormUserPermissions, InputForm, Step, StepState } from '@/types';
import { StepStatus } from '@/types';

import { getWorkflowStepsStyles } from '../styles';
import { CodeView } from './WfoCodeViewSelector';
import { WfoStepForm } from './WfoStepForm';
import { useStepDetailOverride } from './useStepDetailOverride';

interface WfoStepBodyProps {
  step: Step;
  stepContent: StepState;
  hasHtmlMail: boolean;
  isExpanded: boolean;
  codeView: CodeView;
  userInputForm?: InputForm;
  isTask: boolean;
  processId?: string;
  userPermissions: FormUserPermissions;
}

export const WfoStepBody = ({
  step,
  stepContent,
  hasHtmlMail,
  isExpanded,
  codeView,
  userInputForm,
  isTask,
  processId,
  userPermissions,
}: WfoStepBodyProps) => {
  const { stepEmailContainerStyle } = useWithOrchestratorTheme(getWorkflowStepsStyles);
  const { overrideStepDetail } = useStepDetailOverride();

  const hasStepContent = Object.keys(stepContent).length > 0;
  const shouldExpand: boolean = isExpanded && hasStepContent;

  const displayMailConfirmation = (value: EmailState) => {
    if (!value) {
      return '';
    }
    return (
      <EuiText size="s">
        <h4>To</h4>
        <p>
          {value.to.map((v: { email: string; name: string }, i) => (
            <div key={`to-${i}`}>
              {v.name} &lt;
              <a href={`mailto: ${v.email}`}>{v.email}</a>
              &gt;
            </div>
          ))}
        </p>
        <h4>CC</h4>
        <p>
          {value.cc.map((v: { email: string; name: string }, i) => (
            <div key={`cc-${i}`}>
              {v.name} &lt;
              <a href={`mailto: ${v.email}`}>{v.email}</a>
              &gt;
            </div>
          ))}
        </p>
        <h4>Subject</h4>
        <p>{value.subject}</p>
        <h4>Message</h4>
        <div className="emailMessage" dangerouslySetInnerHTML={{ __html: value.message }}></div>
      </EuiText>
    );
  };

  return (
    <>
      {shouldExpand && !hasHtmlMail && (
        <EuiFlexGroup direction="column" gutterSize="none">
          <EuiFlexItem>
            {codeView === CodeView.TABLE ?
              <WfoTableCodeBlock stepState={stepContent} />
            : codeView === CodeView.RAW ?
              <WfoJsonCodeBlock data={stepContent} />
            : <WfoMonacoCodeBlock data={stepContent} />}
          </EuiFlexItem>
          <EuiFlexItem grow={1}>
            {overrideStepDetail?.stepBody && <overrideStepDetail.stepBody step={step} />}
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
      {step.status === StepStatus.SUSPEND && userInputForm && (
        <EuiFlexGroup direction="column" gutterSize="none">
          <EuiFlexItem grow={1}>
            <WfoStepForm
              userInputForm={userInputForm}
              isTask={isTask}
              processId={processId ?? ''}
              userPermissions={userPermissions}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={1}>
            {overrideStepDetail?.stepBody && <overrideStepDetail.stepBody step={step} />}
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
      {isExpanded && hasHtmlMail && (
        <div css={stepEmailContainerStyle}>
          {displayMailConfirmation(step.stateDelta.confirmation_mail as EmailState)}
        </div>
      )}
    </>
  );
};
