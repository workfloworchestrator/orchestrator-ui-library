import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiButton,
  EuiButtonGroup,
  EuiFlexGroup,
  EuiForm,
  EuiFormRow,
  EuiPopover,
  EuiSwitch,
  EuiText,
} from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoCode, WfoEyeFill } from '@/icons';
import { StepDetailLevel } from '@/types';

import { getWorkflowStepsStyles } from '../styles';

export type WfoStepListHeaderProps = {
  detailLevel: StepDetailLevel;
  showDelta: boolean;
  showHiddenKeys: boolean;
  showRaw: boolean;
  showTraceback: boolean;
  showTracebackButton: boolean;
  isRunningWorkflow: boolean;
  isTask: boolean;
  onChangeShowDelta: (showDelta: boolean) => void;
  onChangeShowRaw: (showRaw: boolean) => void;
  onChangeShowHiddenKeys: (showHiddenKeys: boolean) => void;
  onShowTraceback: (showTraceback: boolean) => void;
  onChangeDetailLevel: (detailLevel: StepDetailLevel) => void;
};

export const WfoStepListHeader: FC<WfoStepListHeaderProps> = ({
  detailLevel,
  showDelta,
  showHiddenKeys,
  showRaw,
  showTraceback,
  showTracebackButton,
  isRunningWorkflow,
  isTask,
  onChangeShowDelta,
  onChangeShowRaw,
  onChangeShowHiddenKeys,
  onShowTraceback,
  onChangeDetailLevel,
}) => {
  const t = useTranslations('processes.steps');
  const { theme } = useOrchestratorTheme();
  const { stepListHeaderStyle, stepListContentStyle, stepListContentBoldTextStyle, stepListOptionsContainerStyle } =
    useWithOrchestratorTheme(getWorkflowStepsStyles);

  const [isViewOptionOpen, setIsViewOptionOpen] = useState(false);

  const onViewOptionClick = () => setIsViewOptionOpen((isViewOptionOpen) => !isViewOptionOpen);
  const closeViewOption = () => setIsViewOptionOpen(false);

  const viewOptionButton = (
    <EuiButton
      onClick={onViewOptionClick}
      iconType={() => <WfoEyeFill color={theme.colors.link} />}
      iconSide="right"
      size="s"
    >
      {t('viewOptions')}
    </EuiButton>
  );

  const detailLevelOptions = [
    { id: StepDetailLevel.MINIMAL, label: t('detailMinimal') },
    { id: StepDetailLevel.STANDARD, label: t('detailStandard') },
    { id: StepDetailLevel.HIGH, label: t('detailHigh') },
  ];

  return (
    <EuiFlexGroup css={stepListHeaderStyle}>
      {/* Left side: header and detail level selector */}
      <EuiFlexGroup css={stepListContentStyle}>
        <EuiText size="m" css={stepListContentBoldTextStyle}>
          {t(isTask ? 'taskSteps' : 'workflowSteps')}
        </EuiText>
        {!showRaw && (
          <EuiButtonGroup
            legend={t('detailLevel')}
            options={detailLevelOptions}
            idSelected={detailLevel}
            onChange={(id) => onChangeDetailLevel(id as StepDetailLevel)}
            buttonSize="s"
            color="primary"
          />
        )}
      </EuiFlexGroup>
      {/* Right side: view options */}
      <EuiFlexGroup justifyContent="flexEnd" direction="row" css={stepListOptionsContainerStyle} gutterSize="s">
        {showTracebackButton && (
          <EuiButton onClick={() => onShowTraceback(!showTraceback)} size="s">
            {showTraceback ? t('hideTraceback') : t('showTraceback')}
          </EuiButton>
        )}
        <EuiButton
          onClick={() => onChangeShowDelta(!showDelta)}
          disabled={isRunningWorkflow}
          iconSide="right"
          size="s"
          iconType={() => (
            <WfoCode color={isRunningWorkflow ? theme.colors.backgroundBaseDisabled : theme.colors.link} />
          )}
        >
          {showDelta ? t('hideDelta') : t('showDelta')}
        </EuiButton>
        <EuiPopover button={viewOptionButton} isOpen={isViewOptionOpen} closePopover={closeViewOption} display="block">
          <div>
            <EuiForm component="form">
              <EuiFormRow>
                <EuiSwitch
                  label="Hidden keys"
                  checked={showHiddenKeys}
                  onChange={(e) => {
                    onChangeShowHiddenKeys(e.target.checked);
                    closeViewOption();
                  }}
                />
              </EuiFormRow>
              <EuiFormRow>
                <EuiSwitch
                  label="Raw JSON data"
                  checked={showRaw}
                  onChange={(e) => {
                    onChangeShowRaw(e.target.checked);
                    closeViewOption();
                  }}
                />
              </EuiFormRow>
            </EuiForm>
          </div>
        </EuiPopover>
      </EuiFlexGroup>
    </EuiFlexGroup>
  );
};
