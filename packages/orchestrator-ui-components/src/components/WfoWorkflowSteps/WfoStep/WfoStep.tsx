import React, { LegacyRef, useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

import { WfoJsonCodeBlock, WfoMonacoCodeBlock, WfoTableCodeBlock } from '@/components';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoChevronDown, WfoChevronUp } from '@/icons';
import type { EmailState, FormUserPermissions } from '@/types';
import { StepPresentation, StepStatus } from '@/types';
import { calculateTimeDifference, formatDate } from '@/utils';

import { WfoStepStatusIcon } from '../WfoStepStatusIcon';
import type { StepListItem } from '../WfoWorkflowStepList';
import { getStepContent } from '../stepListUtils';
import { getWorkflowStepsStyles } from '../styles';
import { CodeView, WfoCodeViewSelector } from './WfoCodeViewSelector';
import { WfoStepForm } from './WfoStepForm';
import { useStepDetailOverride } from './useStepDetailOverride';

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
    const isExpanded = presentation === StepPresentation.HIGH;
    const [codeView, setCodeView] = useState<CodeView>(CodeView.JSON);

    const { theme } = useOrchestratorTheme();
    const {
      stepEmailContainerStyle,
      getStepHeaderStyle,
      getStepPanelStyle,
      stepHeaderRightStyle,
      stepListContentBoldTextStyle,
      stepDurationStyle,
      stepRowStyle,
      getStepToggleExpandStyle,
      minimalStepRowStyle,
      minimalStepNameStyle,
      minimalStepHiddenNameStyle,
    } = useWithOrchestratorTheme(getWorkflowStepsStyles);
    const { overrideStepDetail } = useStepDetailOverride();
    const t = useTranslations('processes.steps');
    const hasHtmlMail = Object.prototype.hasOwnProperty.call(step?.stateDelta || {}, 'confirmation_mail');

    const stepContent = step.stateDelta ? getStepContent(step.stateDelta, showHiddenKeys) : {};
    const hasStepContent = hasHtmlMail || Object.keys(stepContent).length > 0;

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

    const handleCodeViewChange = useCallback(
      (newCodeView: CodeView) => {
        setCodeView(newCodeView);
      },
      [setCodeView],
    );

    const shouldExpand: boolean = isExpanded && hasStepContent;
    // A step that was expanded from minimal can always be clicked to shrink it again
    const canShrink = stepListItem.basePresentation === StepPresentation.MINIMAL;
    const isClickable = hasStepContent || canShrink;

    const showRetriedBy = () => {
      if (!isStartStep && step.createdBy && step.createdBy !== previousCreatedBy) {
        return ` - retry: ${step.createdBy}`;
      }
    };

    if (presentation === StepPresentation.MINIMAL) {
      return (
        <div ref={ref}>
          <div
            css={minimalStepRowStyle}
            role="button"
            tabIndex={0}
            aria-expanded={false}
            aria-label={step.name}
            title={`${step.name} - ${step.status}`}
            onClick={() => onToggleStepDetail(hasStepContent)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onToggleStepDetail(hasStepContent);
              }
            }}
          >
            <WfoStepStatusIcon stepStatus={step.status} isStartStep={isStartStep} isMinimal />
            <EuiText
              size="s"
              className="wfoMinimalStepName"
              css={[minimalStepNameStyle, hideMinimalStepName && minimalStepHiddenNameStyle]}
            >
              {step.name}
            </EuiText>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref}>
        <EuiPanel hasBorder={true} css={getStepPanelStyle(isClickable)}>
          <EuiFlexGroup
            className="wfoStepHeader"
            css={getStepHeaderStyle(isClickable)}
            onClick={() => isClickable && onToggleStepDetail(hasStepContent)}
          >
            <WfoStepStatusIcon stepStatus={step.status} isStartStep={isStartStep} />

            <EuiFlexGroup direction="column" gutterSize="none">
              <EuiFlexItem css={{ flexDirection: 'row' }}>
                <EuiFlexItem grow={0}>
                  <EuiText size="m" css={stepListContentBoldTextStyle}>
                    {step.name}
                  </EuiText>
                  <EuiText size="m">
                    {step.status} {step.completed && `- ${formatDate(step.completed)}`}
                    {showRetriedBy()}
                  </EuiText>
                </EuiFlexItem>

                <EuiFlexGroup css={stepRowStyle}>
                  {step.completed && !userInputForm && !hasHtmlMail && (
                    <>
                      {isExpanded && (
                        <WfoCodeViewSelector codeView={codeView} handleCodeViewChange={handleCodeViewChange} />
                      )}
                      <EuiFlexItem grow={0} css={stepHeaderRightStyle}>
                        <EuiText size="m" css={stepDurationStyle}>
                          {t('duration')}
                        </EuiText>
                        <EuiText size="m">{calculateTimeDifference(startedAt, completedAt)}</EuiText>
                      </EuiFlexItem>
                      <EuiFlexItem grow={0} css={getStepToggleExpandStyle(hasStepContent)}>
                        {(isExpanded && <WfoChevronUp color={theme.colors.textParagraph} />) || (
                          <WfoChevronDown color={theme.colors.textParagraph} />
                        )}
                      </EuiFlexItem>
                    </>
                  )}
                </EuiFlexGroup>
              </EuiFlexItem>
              <EuiFlexItem>
                {overrideStepDetail?.stepHeader && <overrideStepDetail.stepHeader step={step} />}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexGroup>
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
        </EuiPanel>
      </div>
    );
  },
);

WfoStep.displayName = 'WfoStep';
