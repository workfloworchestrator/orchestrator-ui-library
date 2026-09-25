import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import {
  DropResult,
  EuiButton,
  EuiCallOut,
  EuiDragDropContext,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiLoadingSpinner,
  EuiSpacer,
} from '@elastic/eui';

import { PATH_START_NEW_TASK, PATH_WORKFLOW_DESIGNER, WfoContentHeader } from '@/components';
import { useShowToastMessage, useWithOrchestratorTheme } from '@/hooks';
import {
  useCreateDesignedWorkflowMutation,
  useGetWorkflowDesignerFieldTypesQuery,
  useGetWorkflowDesignerInfoQuery,
  useGetWorkflowDesignerStepsQuery,
  useUpdateDesignedWorkflowMutation,
  useValidateDesignedWorkflowMutation,
} from '@/rtk';
import {
  ToastTypes,
  WorkflowDesignerDefinition,
  WorkflowDesignerFormField,
  WorkflowDesignerStep,
  WorkflowDesignerValidationResult,
} from '@/types';

import { WfoInitialFormEditor } from './WfoInitialFormEditor';
import { WfoStepInspector } from './WfoStepInspector';
import { WfoStepPalette, isInsertable } from './WfoStepPalette';
import { WfoWorkflowCanvas } from './WfoWorkflowCanvas';
import { getWorkflowDesignerStyles } from './styles';
import {
  CANVAS_DROPPABLE_ID,
  CanvasStep,
  PALETTE_DROPPABLE_ID,
  fromDefinition,
  insertStep,
  mergeFormFields,
  moveStep,
  newCanvasStep,
  removeStep,
  toDefinition,
  updateStepConfig,
  withNamePrefix,
} from './utils';

type Draft = { formFields: WorkflowDesignerFormField[]; steps: CanvasStep[] };

type RequestValidationError = { loc: (string | number)[]; msg: string };
type ApiError = { data?: { detail?: { message?: string } | string | RequestValidationError[] } };

const errorMessage = (error: unknown, fallback: string): string => {
  const detail = (error as ApiError)?.data?.detail;
  if (Array.isArray(detail)) {
    // FastAPI request validation: point at the field, e.g. "form_fields.0.name: String should match pattern".
    return detail.map(({ loc, msg }) => `${loc.filter((part) => part !== 'body').join('.')}: ${msg}`).join('; ');
  }
  return typeof detail === 'string' ? detail : (detail?.message ?? fallback);
};

export type WfoWorkflowDesignerProps = {
  /** The stored definition when editing; a new workflow is designed when it is omitted. */
  existing?: WorkflowDesignerDefinition;
};

export const WfoWorkflowDesigner: FC<WfoWorkflowDesignerProps> = ({ existing }) => {
  const t = useTranslations('workflowDesigner');
  const router = useRouter();
  const { showToastMessage } = useShowToastMessage();
  const { columnsStyle, columnStyle } = useWithOrchestratorTheme(getWorkflowDesignerStyles);

  const { data: info } = useGetWorkflowDesignerInfoQuery();
  const { data: steps, isLoading: isLoadingSteps, isError: isStepsError } = useGetWorkflowDesignerStepsQuery();
  const { data: fieldTypes = [] } = useGetWorkflowDesignerFieldTypesQuery();
  const [validate] = useValidateDesignedWorkflowMutation();
  const [createWorkflow, { isLoading: isCreating }] = useCreateDesignedWorkflowMutation();
  const [updateWorkflow, { isLoading: isUpdating }] = useUpdateDesignedWorkflowMutation();

  const prefix = info?.name_prefix ?? 'designed_';
  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [draft, setDraft] = useState<Draft>({
    formFields: existing?.form_fields ?? [],
    steps: existing ? fromDefinition(existing) : [],
  });
  const [validation, setValidation] = useState<WorkflowDesignerValidationResult | null>(null);
  const [definitionError, setDefinitionError] = useState<string | null>(null);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [previewStep, setPreviewStep] = useState<WorkflowDesignerStep | null>(null);
  const [savedName, setSavedName] = useState<string | null>(existing?.name ?? null);
  const visiblePaletteSteps = useRef<WorkflowDesignerStep[]>([]);
  // Typing in the form editor fires a validation per keystroke; only the latest response may update the view.
  const latestValidation = useRef(0);

  const onVisibleStepsChange = useCallback((visible: WorkflowDesignerStep[]) => {
    visiblePaletteSteps.current = visible;
  }, []);

  const stepsById = useMemo(() => Object.fromEntries((steps ?? []).map((step) => [step.id, step])), [steps]) as Record<
    string,
    WorkflowDesignerStep
  >;

  const fullName = withNamePrefix(name, prefix);
  const definitionFor = useCallback(
    (candidate: Draft) => toDefinition(fullName, description || fullName, candidate.formFields, candidate.steps),
    [fullName, description],
  );

  // Validation is authoritative on the server; the palette status says which steps fit at the end of the chain.
  const runValidation = useCallback(
    async (candidate: Draft) => {
      const request = ++latestValidation.current;
      const result = await validate({ definition: definitionFor(candidate), insertAt: candidate.steps.length });
      if (request !== latestValidation.current) {
        return 'data' in result ? (result.data ?? null) : null;
      }
      if ('data' in result && result.data) {
        setValidation(result.data);
        setDefinitionError(null);
        return result.data;
      }
      // The definition itself is malformed (e.g. a form field without a name); the chain cannot be checked.
      setDefinitionError(errorMessage(result.error, t('saveFailed')));
      setValidation((previous) => previous && { ...previous, valid: false });
      return null;
    },
    [validate, definitionFor, t],
  );

  useEffect(() => {
    runValidation(draft);
    // Only re-validate on changes that affect the chain; the name and description are checked when saving.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const stepErrors = (result: WorkflowDesignerValidationResult) =>
    result.issues.filter((issue) => issue.severity === 'error' && issue.position !== null);

  /** Apply a change to the step chain, but refuse it when it breaks a step that was fine before. */
  const applyChainChange = async (candidate: Draft, rejectMessage: string) => {
    const before = validation ? stepErrors(validation).length : 0;
    const result = await runValidation(candidate);
    if (result && stepErrors(result).length > before) {
      showToastMessage(ToastTypes.ERROR, stepErrors(result)[0].message, rejectMessage);
      await runValidation(draft);
      return;
    }
    setDraft(candidate);
  };

  const addStep = async (step: WorkflowDesignerStep, index: number) => {
    const status = validation?.palette?.[step.id];
    if (!step.usable || !isInsertable(status)) {
      showToastMessage(ToastTypes.ERROR, status?.message ?? step.unusable_reason ?? '', t('notCompatible'));
      return;
    }
    const canvasStep = newCanvasStep(step.id, step.config_defaults ?? {});
    const candidate: Draft = {
      // Missing inputs that a form field can provide are added to the initial form automatically.
      formFields: mergeFormFields(draft.formFields, status?.suggested_fields ?? []),
      steps: insertStep(draft.steps, canvasStep, index),
    };
    await applyChainChange(candidate, t('notCompatible'));
    setSelectedUid(canvasStep.uid);
    setPreviewStep(null);
  };

  const onDragEnd = async ({ source, destination }: DropResult) => {
    if (!destination || destination.droppableId !== CANVAS_DROPPABLE_ID) {
      return;
    }
    if (source.droppableId === PALETTE_DROPPABLE_ID) {
      const step = visiblePaletteSteps.current[source.index];
      if (step) {
        await addStep(step, destination.index);
      }
    } else if (source.index !== destination.index) {
      await applyChainChange(
        { ...draft, steps: moveStep(draft.steps, source.index, destination.index) },
        t('invalidOrder'),
      );
    }
  };

  const onRemove = async (uid: string) => {
    await applyChainChange({ ...draft, steps: removeStep(draft.steps, uid) }, t('stillNeeded'));
    if (selectedUid === uid) {
      setSelectedUid(null);
    }
  };

  const onSave = async () => {
    const definition = definitionFor(draft);
    const result = savedName ? await updateWorkflow(definition) : await createWorkflow(definition);
    if ('error' in result) {
      showToastMessage(ToastTypes.ERROR, errorMessage(result.error, t('saveFailed')), t('saveFailed'));
      return;
    }
    showToastMessage(ToastTypes.SUCCESS, definition.name, t('saved'));
    if (!savedName) {
      setSavedName(definition.name);
      router.replace(`${PATH_WORKFLOW_DESIGNER}/${definition.name}`);
    }
  };

  if (isLoadingSteps) {
    return <EuiLoadingSpinner size="xl" />;
  }
  if (isStepsError || !steps) {
    return <EuiCallOut color="danger" title={t('loadFailed')} />;
  }

  const selectedStep = draft.steps.find((step) => step.uid === selectedUid);
  const selectedIndex = selectedStep ? draft.steps.indexOf(selectedStep) : -1;
  const issues = validation?.issues ?? [];
  const formIssues = issues.filter((issue) => issue.position === null);
  const canSave = Boolean(name && description && validation?.valid && !isCreating && !isUpdating);

  const inspector = () => {
    if (previewStep) {
      return <WfoStepInspector step={previewStep} />;
    }
    if (selectedStep && stepsById[selectedStep.step_id]) {
      return (
        <WfoStepInspector
          step={stepsById[selectedStep.step_id]}
          config={selectedStep.config}
          issues={issues.filter((issue) => issue.position === selectedIndex)}
          onConfigChange={(config) =>
            setDraft({ ...draft, steps: updateStepConfig(draft.steps, selectedStep.uid, config) })
          }
        />
      );
    }
    return (
      <WfoInitialFormEditor
        fields={draft.formFields}
        fieldTypes={fieldTypes}
        onChange={(formFields) => setDraft({ ...draft, formFields })}
      />
    );
  };

  return (
    <>
      <WfoContentHeader title={savedName ? t('editTitle', { name: savedName }) : t('newTitle')}>
        <EuiButton onClick={onSave} fill isDisabled={!canSave} isLoading={isCreating || isUpdating}>
          {t('save')}
        </EuiButton>
        <EuiButton
          iconType="play"
          isDisabled={!savedName}
          onClick={() => router.push(`${PATH_START_NEW_TASK}/${savedName}`)}
        >
          {t('startTask')}
        </EuiButton>
      </WfoContentHeader>

      <EuiFlexGroup gutterSize="m">
        <EuiFlexItem grow={1}>
          <EuiFormRow label={t('name')} helpText={t('nameHelp', { prefix })} fullWidth>
            <EuiFieldText
              fullWidth
              value={name}
              disabled={Boolean(savedName)}
              prepend={name.startsWith(prefix) ? undefined : prefix}
              onChange={(event) => setName(event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={2}>
          <EuiFormRow label={t('description')} helpText={t('descriptionHelp')} fullWidth>
            <EuiFieldText fullWidth value={description} onChange={(event) => setDescription(event.target.value)} />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>

      {definitionError && (
        <>
          <EuiSpacer size="m" />
          <EuiCallOut size="s" color="danger" title={definitionError} />
        </>
      )}
      {formIssues.length > 0 && (
        <>
          <EuiSpacer size="m" />
          <EuiCallOut size="s" color="warning" title={formIssues.map((issue) => issue.message).join('; ')} />
        </>
      )}
      <EuiSpacer size="l" />

      <EuiDragDropContext onDragEnd={onDragEnd}>
        <div css={columnsStyle}>
          <div css={columnStyle}>
            <WfoStepPalette
              steps={steps}
              palette={validation?.palette ?? null}
              onAdd={(step) => addStep(step, draft.steps.length)}
              onSelect={(step) => {
                setPreviewStep(step);
                setSelectedUid(null);
              }}
              onVisibleStepsChange={onVisibleStepsChange}
            />
          </div>
          <div css={columnStyle}>
            <WfoWorkflowCanvas
              steps={draft.steps}
              stepsById={stepsById}
              formFields={draft.formFields}
              available={validation?.available ?? []}
              issues={issues}
              selectedUid={previewStep ? '' : selectedUid}
              onSelectStep={(uid) => {
                setSelectedUid(uid);
                setPreviewStep(null);
              }}
              onSelectForm={() => {
                setSelectedUid(null);
                setPreviewStep(null);
              }}
              onRemove={onRemove}
            />
          </div>
          <div css={columnStyle}>{inspector()}</div>
        </div>
      </EuiDragDropContext>
    </>
  );
};
