export type WorkflowDesignerTypeKind =
  | 'str'
  | 'int'
  | 'float'
  | 'bool'
  | 'uuid'
  | 'list'
  | 'dict'
  | 'subscription'
  | 'any';

export interface WorkflowDesignerTypeRef {
  kind: WorkflowDesignerTypeKind;
  optional: boolean;
  model: string | null;
  product_tags: string[];
  statuses: string[];
}

export interface WorkflowDesignerStateKey {
  key: string;
  type: WorkflowDesignerTypeRef;
  guaranteed: boolean;
}

export interface WorkflowDesignerStepInput {
  name: string;
  type: WorkflowDesignerTypeRef;
  annotation: string;
  required: boolean;
  default: unknown;
  source: 'state' | 'subscription_model' | 'whole_state';
}

export type WorkflowDesignerStepKind = 'step' | 'retrystep' | 'inputstep' | 'helper';

export interface WorkflowDesignerStep {
  id: string;
  name: string;
  function: string;
  module: string;
  category: string;
  description: string;
  kind: WorkflowDesignerStepKind;
  inputs: WorkflowDesignerStepInput[];
  outputs: WorkflowDesignerStateKey[];
  outputs_known: boolean;
  usable: boolean;
  unusable_reason: string | null;
  writes_subscription: boolean;
  uses_subscription_models: boolean;
  used_in_workflows: string[];
  config_schema: WorkflowDesignerJsonSchema | null;
  config_defaults: Record<string, unknown> | null;
  pauses: boolean;
}

export interface WorkflowDesignerJsonSchema {
  properties?: Record<
    string,
    {
      title?: string;
      type?: string;
      description?: string;
      default?: unknown;
      enum?: string[];
      anyOf?: { type?: string }[];
    }
  >;
  required?: string[];
}

export interface WorkflowDesignerFieldOptions {
  choices: string[];
  product_tags: string[];
  statuses: string[];
}

export interface WorkflowDesignerFormField {
  name: string;
  type: string;
  title: string;
  description: string;
  required: boolean;
  default: unknown;
  options: WorkflowDesignerFieldOptions;
}

export interface WorkflowDesignerFieldType {
  key: string;
  label: string;
  options: ('choices' | 'product_tags' | 'statuses')[];
}

export interface WorkflowDesignerStepRef {
  step_id: string;
  config: Record<string, unknown>;
}

export interface WorkflowDesignerDefinition {
  name: string;
  description: string;
  form_fields: WorkflowDesignerFormField[];
  steps: WorkflowDesignerStepRef[];
}

export interface WorkflowDesignerIssue {
  severity: 'warning' | 'error';
  message: string;
  position: number | null;
  step_id: string | null;
  input: string | null;
}

export type WorkflowDesignerPaletteStatusKind = 'ok' | 'warning' | 'needs_form' | 'incompatible' | 'unusable';

export interface WorkflowDesignerPaletteStatus {
  status: WorkflowDesignerPaletteStatusKind;
  message: string;
  suggested_fields: WorkflowDesignerFormField[];
}

export interface WorkflowDesignerValidationResult {
  valid: boolean;
  issues: WorkflowDesignerIssue[];
  available: WorkflowDesignerStateKey[][];
  palette: Record<string, WorkflowDesignerPaletteStatus> | null;
}

export interface WorkflowDesignerStoredWorkflow {
  definition: WorkflowDesignerDefinition;
  version: number;
  created_by: string | null;
  process_count: number;
}

export interface WorkflowDesignerInfo {
  name_prefix: string;
  step_count: number;
}
