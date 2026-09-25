import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiBadge,
  EuiButtonIcon,
  EuiDraggable,
  EuiDroppable,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiText,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import {
  WorkflowDesignerFormField,
  WorkflowDesignerIssue,
  WorkflowDesignerStateKey,
  WorkflowDesignerStep,
} from '@/types';

import { getWorkflowDesignerStyles } from './styles';
import { CANVAS_DRAGGABLE_PREFIX, CANVAS_DROPPABLE_ID, CanvasStep, typeLabel } from './utils';

export type WfoWorkflowCanvasProps = {
  steps: CanvasStep[];
  stepsById: Record<string, WorkflowDesignerStep>;
  formFields: WorkflowDesignerFormField[];
  available: WorkflowDesignerStateKey[][];
  issues: WorkflowDesignerIssue[];
  selectedUid: string | null;
  onSelectStep: (uid: string) => void;
  onSelectForm: () => void;
  onRemove: (uid: string) => void;
};

const StateChips: FC<{
  before: WorkflowDesignerStateKey[] | undefined;
  after: WorkflowDesignerStateKey[] | undefined;
}> = ({ before, after }) => {
  const t = useTranslations('workflowDesigner.canvas');
  const { stateChipsStyle } = useWithOrchestratorTheme(getWorkflowDesignerStyles);
  const known = new Set((before ?? []).map((stateKey) => stateKey.key));
  const added = (after ?? []).filter((stateKey) => !known.has(stateKey.key));
  if (!added.length) {
    return <div css={stateChipsStyle} />;
  }
  return (
    <div css={stateChipsStyle}>
      <EuiText size="xs" color="subdued">
        {t('adds')}
      </EuiText>
      {added.map((stateKey) => (
        <EuiBadge key={stateKey.key} color="hollow">
          {stateKey.key}: {typeLabel(stateKey.type)}
        </EuiBadge>
      ))}
    </div>
  );
};

export const WfoWorkflowCanvas: FC<WfoWorkflowCanvasProps> = ({
  steps,
  stepsById,
  formFields,
  available,
  issues,
  selectedUid,
  onSelectStep,
  onSelectForm,
  onRemove,
}) => {
  const t = useTranslations('workflowDesigner.canvas');
  const { fixedCardStyle, stepCardStyle, selectedStepCardStyle, emptyCanvasStyle, scrollAreaStyle } =
    useWithOrchestratorTheme(getWorkflowDesignerStyles);

  const issuesAt = (position: number) => issues.filter((issue) => issue.position === position);
  const engineKeys = new Set(['process_id', 'reporter', 'workflow_name', 'workflow_target']);
  const formKeys = (available[0] ?? []).filter((stateKey) => !engineKeys.has(stateKey.key));

  return (
    <EuiPanel hasBorder paddingSize="m">
      <EuiTitle size="xs">
        <h3>{t('title')}</h3>
      </EuiTitle>
      <EuiText size="xs" color="subdued">
        {t('help')}
      </EuiText>
      <div css={scrollAreaStyle}>
        <EuiPanel
          paddingSize="none"
          hasShadow={false}
          css={[fixedCardStyle, selectedUid === null && selectedStepCardStyle]}
          onClick={onSelectForm}
        >
          <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiIcon type="documentEdit" />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="s">
                <strong>{t('initialForm')}</strong>
              </EuiText>
              <EuiText size="xs" color="subdued">
                {formFields.length ? formFields.map((field) => field.name).join(', ') : t('noFormFields')}
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
        <StateChips before={[]} after={formKeys} />

        <EuiDroppable droppableId={CANVAS_DROPPABLE_ID} spacing="none" grow>
          {steps.length === 0 ?
            <div css={emptyCanvasStyle}>{t('empty')}</div>
          : steps.map((canvasStep, index) => {
              const info = stepsById[canvasStep.step_id];
              const stepIssues = issuesAt(index);
              const hasError = stepIssues.some((issue) => issue.severity === 'error');
              const hasWarning = stepIssues.some((issue) => issue.severity === 'warning');
              return (
                <EuiDraggable
                  key={canvasStep.uid}
                  index={index}
                  draggableId={`${CANVAS_DRAGGABLE_PREFIX}${canvasStep.uid}`}
                  spacing="none"
                  hasInteractiveChildren
                >
                  <div>
                    <EuiPanel
                      hasBorder
                      paddingSize="none"
                      css={[stepCardStyle, selectedUid === canvasStep.uid && selectedStepCardStyle]}
                      color={hasError ? 'danger' : 'plain'}
                      onClick={() => onSelectStep(canvasStep.uid)}
                    >
                      <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                        <EuiFlexItem grow={false}>
                          <EuiBadge color="default">{index + 1}</EuiBadge>
                        </EuiFlexItem>
                        <EuiFlexItem css={{ minWidth: 0 }}>
                          <EuiText size="s">
                            <strong>{info?.name ?? canvasStep.step_id}</strong>
                          </EuiText>
                          <EuiText size="xs" color="subdued">
                            {info?.inputs.length ?
                              `${t('needs')} ${info.inputs.map((input) => input.name).join(', ')}`
                            : t('noInputs')}
                          </EuiText>
                        </EuiFlexItem>
                        {(hasError || hasWarning) && (
                          <EuiFlexItem grow={false}>
                            <EuiToolTip content={stepIssues.map((issue) => issue.message).join('\n')}>
                              <EuiIcon type={hasError ? 'error' : 'warning'} color={hasError ? 'danger' : 'warning'} />
                            </EuiToolTip>
                          </EuiFlexItem>
                        )}
                        <EuiFlexItem grow={false}>
                          <EuiButtonIcon
                            iconType="trash"
                            color="danger"
                            aria-label={t('remove')}
                            onClick={(event: React.MouseEvent) => {
                              event.stopPropagation();
                              onRemove(canvasStep.uid);
                            }}
                          />
                        </EuiFlexItem>
                      </EuiFlexGroup>
                    </EuiPanel>
                    <StateChips before={available[index]} after={available[index + 1]} />
                  </div>
                </EuiDraggable>
              );
            })
          }
        </EuiDroppable>

        <EuiPanel paddingSize="none" hasShadow={false} css={fixedCardStyle}>
          <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiIcon type="checkInCircleFilled" color="success" />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="s">
                <strong>{t('done')}</strong>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </div>
    </EuiPanel>
  );
};
