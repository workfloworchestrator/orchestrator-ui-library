import React from 'react';

import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { WorkflowDesignerDefinition, WorkflowDesignerStep, WorkflowDesignerValidationResult } from '@/types';

import { WfoWorkflowDesigner } from './WfoWorkflowDesigner';

const showToastMessage = jest.fn();
const validate = jest.fn();
const createWorkflow = jest.fn();

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useWithOrchestratorTheme: () => ({}),
  useShowToastMessage: () => ({ showToastMessage }),
}));

const step = (overrides: Partial<WorkflowDesignerStep>): WorkflowDesignerStep => ({
  id: 'm:step',
  name: 'Step',
  function: 'step',
  module: 'm',
  category: 'tasks',
  description: '',
  kind: 'step',
  inputs: [],
  outputs: [],
  outputs_known: true,
  usable: true,
  unusable_reason: null,
  writes_subscription: false,
  uses_subscription_models: false,
  used_in_workflows: [],
  config_schema: null,
  config_defaults: null,
  pauses: false,
  ...overrides,
});

const STEPS = [step({ id: 'm:update_dns', name: 'Update DNS' }), step({ id: 'm:needs_record', name: 'Needs record' })];

const result = (
  definition: WorkflowDesignerDefinition,
  palette: WorkflowDesignerValidationResult['palette'],
): WorkflowDesignerValidationResult => ({
  valid: definition.steps.length > 0,
  issues: [],
  available: [],
  palette,
});

jest.mock('@/rtk', () => ({
  ...jest.requireActual('@/rtk'),
  useGetWorkflowDesignerInfoQuery: () => ({ data: { name_prefix: 'designed_', step_count: 2 } }),
  useGetWorkflowDesignerStepsQuery: () => ({ data: STEPS, isLoading: false, isError: false }),
  useGetWorkflowDesignerFieldTypesQuery: () => ({
    data: [{ key: 'string', label: 'Text', options: [] }],
  }),
  useValidateDesignedWorkflowMutation: () => [validate],
  useCreateDesignedWorkflowMutation: () => [createWorkflow, { isLoading: false }],
  useUpdateDesignedWorkflowMutation: () => [jest.fn(), { isLoading: false }],
}));

describe('WfoWorkflowDesigner', () => {
  beforeEach(() => {
    validate.mockImplementation(async ({ definition }: { definition: WorkflowDesignerDefinition }) => ({
      data: result(definition, {
        'm:update_dns': {
          status: 'needs_form',
          message: 'adds form field(s) zone',
          suggested_fields: [
            {
              name: 'zone',
              type: 'string',
              title: 'Zone',
              description: '',
              required: true,
              default: null,
              options: { choices: [], product_tags: [], statuses: [] },
            },
          ],
        },
        'm:needs_record': { status: 'incompatible', message: "needs 'record'", suggested_fields: [] },
      }),
    }));
  });

  it('adds a step and the form field it needs', async () => {
    render(<WfoWorkflowDesigner />);
    await waitFor(() => expect(validate).toHaveBeenCalled());

    const addButtons = screen.getAllByLabelText('add');
    await act(async () => fireEvent.click(addButtons[0]));

    // Palette, canvas card and the inspector, which opens on the step that was just added.
    await waitFor(() => expect(screen.getAllByText('Update DNS')).toHaveLength(3));
    expect(screen.getByRole('heading', { name: 'Update DNS' })).toBeInTheDocument();
    expect(showToastMessage).not.toHaveBeenCalled();
    const lastDefinition = validate.mock.calls[validate.mock.calls.length - 1][0].definition;
    expect(lastDefinition.steps).toEqual([{ step_id: 'm:update_dns', config: {} }]);
    expect(lastDefinition.form_fields.map((field: { name: string }) => field.name)).toEqual(['zone']);
  });

  it('refuses a step whose inputs are not available', async () => {
    render(<WfoWorkflowDesigner />);
    await waitFor(() => expect(validate).toHaveBeenCalled());

    const addButtons = screen.getAllByLabelText('add');
    expect(addButtons[1]).toBeDisabled();
    expect(screen.getByText('status.incompatible')).toBeInTheDocument();
    expect(screen.getAllByText('Needs record')).toHaveLength(1);
  });
});
