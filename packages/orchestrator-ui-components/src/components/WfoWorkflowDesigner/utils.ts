import {
  WorkflowDesignerDefinition,
  WorkflowDesignerFormField,
  WorkflowDesignerStep,
  WorkflowDesignerStepRef,
  WorkflowDesignerTypeRef,
} from '@/types';

// A step can appear more than once in a workflow, so canvas items need their own id for drag and drop and React keys.
export interface CanvasStep extends WorkflowDesignerStepRef {
  uid: string;
}

export const PALETTE_DROPPABLE_ID = 'workflowDesignerPalette';
export const CANVAS_DROPPABLE_ID = 'workflowDesignerCanvas';
export const PALETTE_DRAGGABLE_PREFIX = 'palette:';
export const CANVAS_DRAGGABLE_PREFIX = 'canvas:';
export const HELPER_CATEGORY = 'designer';

let uidCounter = 0;
export const newCanvasStep = (stepId: string, config: Record<string, unknown> = {}): CanvasStep => {
  uidCounter += 1;
  return { uid: `${Date.now()}-${uidCounter}`, step_id: stepId, config: { ...config } };
};

export const insertStep = (steps: CanvasStep[], step: CanvasStep, index: number): CanvasStep[] => [
  ...steps.slice(0, index),
  step,
  ...steps.slice(index),
];

export const moveStep = (steps: CanvasStep[], from: number, to: number): CanvasStep[] => {
  const moved = steps[from];
  const without = steps.filter((_, index) => index !== from);
  return insertStep(without, moved, to);
};

export const removeStep = (steps: CanvasStep[], uid: string): CanvasStep[] => steps.filter((step) => step.uid !== uid);

export const updateStepConfig = (steps: CanvasStep[], uid: string, config: Record<string, unknown>): CanvasStep[] =>
  steps.map((step) => (step.uid === uid ? { ...step, config } : step));

/** Add suggested form fields whose name is not in the form yet; existing fields keep their settings. */
export const mergeFormFields = (
  fields: WorkflowDesignerFormField[],
  suggestions: WorkflowDesignerFormField[],
): WorkflowDesignerFormField[] => {
  const names = new Set(fields.map((field) => field.name));
  return [...fields, ...suggestions.filter((suggestion) => !names.has(suggestion.name))];
};

export const toDefinition = (
  name: string,
  description: string,
  formFields: WorkflowDesignerFormField[],
  steps: CanvasStep[],
): WorkflowDesignerDefinition => ({
  name,
  description,
  form_fields: formFields,
  steps: steps.map(({ step_id, config }) => ({ step_id, config })),
});

export const fromDefinition = (definition: WorkflowDesignerDefinition): CanvasStep[] =>
  definition.steps.map((step) => newCanvasStep(step.step_id, step.config));

export interface PaletteFilter {
  search: string;
  category: string;
  showUnusable: boolean;
  showSubscriptionWriters: boolean;
}

export const filterPaletteSteps = (steps: WorkflowDesignerStep[], filter: PaletteFilter): WorkflowDesignerStep[] => {
  const search = filter.search.trim().toLowerCase();
  return steps.filter(
    (step) =>
      (filter.showUnusable || step.usable)
      && (filter.showSubscriptionWriters || !step.writes_subscription)
      && (!filter.category || step.category === filter.category)
      && (!search
        || step.name.toLowerCase().includes(search)
        || step.id.toLowerCase().includes(search)
        || step.description.toLowerCase().includes(search)),
  );
};

export const stepCategories = (steps: WorkflowDesignerStep[]): string[] =>
  [...new Set(steps.map((step) => step.category))].sort((a, b) =>
    // Helpers first: they are what glues the other steps together.
    a === HELPER_CATEGORY ? -1
    : b === HELPER_CATEGORY ? 1
    : a.localeCompare(b),
  );

export const typeLabel = (type: WorkflowDesignerTypeRef): string => {
  const base = type.kind === 'subscription' && type.model ? type.model : type.kind;
  return type.optional ? `${base}?` : base;
};

export const DEFAULT_FORM_FIELD: WorkflowDesignerFormField = {
  name: '',
  type: 'string',
  title: '',
  description: '',
  required: true,
  default: null,
  options: { choices: [], product_tags: [], statuses: [] },
};

export const withNamePrefix = (name: string, prefix: string): string =>
  name.startsWith(prefix) ? name : `${prefix}${name}`;
