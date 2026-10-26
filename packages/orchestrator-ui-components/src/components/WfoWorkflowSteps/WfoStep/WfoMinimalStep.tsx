import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoChevronDown } from '@/icons';
import type { Step } from '@/types';
import { calculateTimeDifference } from '@/utils';

import { WfoStepStatusIcon } from '../WfoStepStatusIcon';
import { getWorkflowStepsStyles } from '../styles';

interface WfoMinimalStepProps {
  step: Step;
  startedAt: string;
  completedAt: string;
  isStartStep: boolean;
  hideStepName: boolean;
  onToggle: () => void;
}

export const WfoMinimalStep = ({
  step,
  startedAt,
  completedAt,
  isStartStep,
  hideStepName,
  onToggle,
}: WfoMinimalStepProps) => {
  const { theme } = useOrchestratorTheme();
  const {
    stepHeaderRightStyle,
    stepDurationStyle,
    stepRowStyle,
    getStepToggleExpandStyle,
    minimalStepRowStyle,
    minimalStepNameStyle,
    minimalStepHiddenNameStyle,
    minimalStepDurationStyle,
    minimalStepDurationLabelStyle,
  } = useWithOrchestratorTheme(getWorkflowStepsStyles);
  const t = useTranslations('processes.steps');

  return (
    <div
      css={minimalStepRowStyle}
      role="button"
      tabIndex={0}
      aria-expanded={false}
      aria-label={step.name}
      title={`${step.name} - ${step.status}`}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <WfoStepStatusIcon stepStatus={step.status} isStartStep={isStartStep} isMinimal />
      <EuiText
        size="s"
        className="wfoMinimalStepName"
        data-text={step.name}
        css={[minimalStepNameStyle, hideStepName && minimalStepHiddenNameStyle]}
      >
        {step.name}
      </EuiText>
      {/* Same right-hand layout as the step card header, so the durations line up */}
      <EuiFlexGroup css={stepRowStyle}>
        {step.completed && (
          <>
            <EuiFlexItem grow={0} css={stepHeaderRightStyle} title={t('duration')}>
              <EuiText size="m" css={[stepDurationStyle, minimalStepDurationLabelStyle]} aria-hidden>
                {t('duration')}
              </EuiText>
              <EuiText size="s" css={minimalStepDurationStyle}>
                {calculateTimeDifference(startedAt, completedAt)}
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={0} css={getStepToggleExpandStyle(false)} aria-hidden>
              <WfoChevronDown color={theme.colors.textParagraph} />
            </EuiFlexItem>
          </>
        )}
      </EuiFlexGroup>
    </div>
  );
};
