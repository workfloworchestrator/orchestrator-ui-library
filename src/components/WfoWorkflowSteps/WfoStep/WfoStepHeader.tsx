import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoChevronDown, WfoChevronUp } from '@/icons';
import type { Step } from '@/types';
import { calculateTimeDifference, formatDate } from '@/utils';

import { WfoStepStatusIcon } from '../WfoStepStatusIcon';
import { getWorkflowStepsStyles } from '../styles';
import { CodeView, WfoCodeViewSelector } from './WfoCodeViewSelector';
import { useStepDetailOverride } from './useStepDetailOverride';

interface WfoStepHeaderProps {
  step: Step;
  previousCreatedBy?: string;
  startedAt: string;
  completedAt: string;
  isStartStep: boolean;
  isExpanded: boolean;
  isClickable: boolean;
  hasStepContent: boolean;
  showDetails: boolean;
  codeView: CodeView;
  onCodeViewChange: (codeView: CodeView) => void;
  onToggle: () => void;
}

export const WfoStepHeader = React.forwardRef<HTMLDivElement, WfoStepHeaderProps>(
  (
    {
      step,
      previousCreatedBy,
      startedAt,
      completedAt,
      isStartStep,
      isExpanded,
      isClickable,
      hasStepContent,
      showDetails,
      codeView,
      onCodeViewChange,
      onToggle,
    },
    ref,
  ) => {
    const { theme } = useOrchestratorTheme();
    const {
      getStepHeaderStyle,
      stepHeaderRightStyle,
      stepListContentBoldTextStyle,
      stepDurationStyle,
      stepRowStyle,
      getStepToggleExpandStyle,
    } = useWithOrchestratorTheme(getWorkflowStepsStyles);
    const { overrideStepDetail } = useStepDetailOverride();
    const t = useTranslations('processes.steps');

    const showRetriedBy = () => {
      if (!isStartStep && step.createdBy && step.createdBy !== previousCreatedBy) {
        return ` - retry: ${step.createdBy}`;
      }
    };

    // Only acts as a button when the step can be toggled, so steps without details are skipped when tabbing
    const toggleProps = isClickable && {
      role: 'button',
      tabIndex: 0,
      'aria-expanded': isExpanded,
      'aria-label': step.name,
      onClick: onToggle,
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Keys pressed on controls inside the header, like the code view selector, shouldn't toggle the step
        if (event.target !== event.currentTarget) {
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      },
    };

    return (
      <EuiFlexGroup ref={ref} className="wfoStepHeader" css={getStepHeaderStyle(isClickable)} {...toggleProps}>
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
              {step.completed && showDetails && (
                <>
                  {isExpanded && <WfoCodeViewSelector codeView={codeView} handleCodeViewChange={onCodeViewChange} />}
                  <EuiFlexItem grow={0} css={stepHeaderRightStyle}>
                    <EuiText size="m" css={stepDurationStyle}>
                      {t('duration')}
                    </EuiText>
                    <EuiText size="m">{calculateTimeDifference(startedAt, completedAt)}</EuiText>
                  </EuiFlexItem>
                  <EuiFlexItem grow={0} css={getStepToggleExpandStyle(hasStepContent)} aria-hidden>
                    {(isExpanded && <WfoChevronUp color={theme.colors.textParagraph} />) || (
                      <WfoChevronDown color={theme.colors.textParagraph} />
                    )}
                  </EuiFlexItem>
                </>
              )}
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexItem>{overrideStepDetail?.stepHeader && <overrideStepDetail.stepHeader step={step} />}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexGroup>
    );
  },
);

WfoStepHeader.displayName = 'WfoStepHeader';
