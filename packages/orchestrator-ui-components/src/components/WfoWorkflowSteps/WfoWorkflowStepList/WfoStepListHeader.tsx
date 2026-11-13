import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiFlexGroup,
  EuiForm,
  EuiFormRow,
  EuiHorizontalRule,
  EuiPopover,
  EuiRadioGroup,
  EuiSwitch,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoCode, WfoEyeFill } from '@/icons';
import { StepDetailLevel } from '@/types';

import { getWorkflowStepsStyles } from '../styles';

export type WfoStepListHeaderProps = {
  detailLevel: StepDetailLevel;
  showDelta: boolean;
  showHiddenKeys: boolean;
  hideMinimalStepNames: boolean;
  showRaw: boolean;
  showTraceback: boolean;
  showTracebackButton: boolean;
  isRunningWorkflow: boolean;
  isTask: boolean;
  onChangeShowDelta: (showDelta: boolean) => void;
  onChangeShowRaw: (showRaw: boolean) => void;
  onChangeShowHiddenKeys: (showHiddenKeys: boolean) => void;
  onChangeHideMinimalStepNames: (hideMinimalStepNames: boolean) => void;
  onShowTraceback: (showTraceback: boolean) => void;
  onChangeDetailLevel: (detailLevel: StepDetailLevel) => void;
  /** New process page layout: one tight row, title on one line, quiet secondary buttons */
  isCompact?: boolean;
};

export const WfoStepListHeader: FC<WfoStepListHeaderProps> = ({
  detailLevel,
  showDelta,
  showHiddenKeys,
  hideMinimalStepNames,
  showRaw,
  showTraceback,
  showTracebackButton,
  isRunningWorkflow,
  isTask,
  onChangeShowDelta,
  onChangeShowRaw,
  onChangeShowHiddenKeys,
  onChangeHideMinimalStepNames,
  onShowTraceback,
  onChangeDetailLevel,
  isCompact = false,
}) => {
  const t = useTranslations('processes.steps');
  const { theme } = useOrchestratorTheme();
  const { stepListHeaderStyle, stepListContentStyle, stepListTitleStyle, stepListOptionsContainerStyle } =
    useWithOrchestratorTheme(getWorkflowStepsStyles);

  const [isViewOptionOpen, setIsViewOptionOpen] = useState(false);

  const onViewOptionClick = () => setIsViewOptionOpen((isViewOptionOpen) => !isViewOptionOpen);
  const closeViewOption = () => setIsViewOptionOpen(false);

  // Secondary actions are quiet in the compact header, so the detail-level switch stays the main control
  const SecondaryButton = isCompact ? EuiButtonEmpty : EuiButton;
  const compactHeaderStyle = isCompact && {
    marginTop: 0,
    marginBottom: theme.size.m,
    alignItems: 'center' as const,
    flexWrap: 'wrap' as const,
    rowGap: theme.size.s,
  };

  const detailLevelOptions = [
    { id: StepDetailLevel.MINIMAL, label: t('detailMinimal') },
    { id: StepDetailLevel.STANDARD, label: t('detailStandard') },
    { id: StepDetailLevel.HIGH, label: t('detailHigh') },
  ];

  const viewOptionButton = (
    <SecondaryButton
      onClick={onViewOptionClick}
      iconType={() => <WfoEyeFill color={theme.colors.link} />}
      iconSide="right"
      size="s"
    >
      {t('viewOptions')}
    </SecondaryButton>
  );

  return (
    <EuiFlexGroup css={[stepListHeaderStyle, compactHeaderStyle]}>
      {/* Left side: header and detail level selector */}
      <EuiFlexGroup css={stepListContentStyle}>
        {(isCompact && (
          <EuiTitle size="s" css={{ whiteSpace: 'nowrap' }}>
            <h2>{t(isTask ? 'taskSteps' : 'workflowSteps')}</h2>
          </EuiTitle>
        )) || (
          <EuiText size="m" css={stepListTitleStyle}>
            {t(isTask ? 'taskSteps' : 'workflowSteps')}
          </EuiText>
        )}
        {!showRaw && !isCompact && (
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
          <SecondaryButton
            onClick={() => onShowTraceback(!showTraceback)}
            size="s"
            {...(isCompact && { color: 'danger' as const, iconType: 'warning' })}
          >
            {showTraceback ? t('hideTraceback') : t('showTraceback')}
          </SecondaryButton>
        )}
        <SecondaryButton
          onClick={() => onChangeShowDelta(!showDelta)}
          disabled={isRunningWorkflow}
          iconSide="right"
          size="s"
          iconType={() => (
            <WfoCode color={isRunningWorkflow ? theme.colors.backgroundBaseDisabled : theme.colors.link} />
          )}
        >
          {showDelta ? t('hideDelta') : t('showDelta')}
        </SecondaryButton>
        <EuiPopover button={viewOptionButton} isOpen={isViewOptionOpen} closePopover={closeViewOption} display="block">
          <div>
            <EuiForm component="form">
              {isCompact && !showRaw && (
                <>
                  <EuiFormRow label={t('display')}>
                    <EuiRadioGroup
                      name="step-detail-level"
                      options={detailLevelOptions}
                      idSelected={detailLevel}
                      onChange={(id) => {
                        onChangeDetailLevel(id as StepDetailLevel);
                        closeViewOption();
                      }}
                    />
                  </EuiFormRow>
                  <EuiHorizontalRule margin="s" />
                </>
              )}
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
                  label={t('hideMinimalStepNames')}
                  checked={hideMinimalStepNames}
                  onChange={(e) => {
                    onChangeHideMinimalStepNames(e.target.checked);
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
