import { WorkflowDesignerFormField, WorkflowDesignerStep } from '@/types';

import {
  CanvasStep,
  DEFAULT_FORM_FIELD,
  filterPaletteSteps,
  insertStep,
  mergeFormFields,
  moveStep,
  removeStep,
  stepCategories,
  toDefinition,
  updateStepConfig,
  withNamePrefix,
} from './utils';

const canvasStep = (uid: string, stepId = `m:${uid}`): CanvasStep => ({ uid, step_id: stepId, config: {} });

const paletteStep = (overrides: Partial<WorkflowDesignerStep>): WorkflowDesignerStep => ({
  id: 'm:step',
  name: 'Step',
  function: 'step',
  module: 'm',
  category: 'general',
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

describe('workflow designer canvas operations', () => {
  const steps = [canvasStep('a'), canvasStep('b'), canvasStep('c')];

  it('inserts at an index', () => {
    expect(insertStep(steps, canvasStep('x'), 1).map((step) => step.uid)).toEqual(['a', 'x', 'b', 'c']);
  });

  it.each([
    [0, 2, ['b', 'c', 'a']],
    [2, 0, ['c', 'a', 'b']],
    [1, 1, ['a', 'b', 'c']],
  ])('moves from %i to %i', (from, to, expected) => {
    expect(moveStep(steps, from, to).map((step) => step.uid)).toEqual(expected);
  });

  it('removes by uid, keeping other instances of the same step', () => {
    const duplicated = [canvasStep('a', 'm:same'), canvasStep('b', 'm:same')];
    expect(removeStep(duplicated, 'a').map((step) => step.uid)).toEqual(['b']);
  });

  it('updates the config of one step', () => {
    expect(updateStepConfig(steps, 'b', { key: 'x' })[1].config).toEqual({ key: 'x' });
    expect(updateStepConfig(steps, 'b', { key: 'x' })[0].config).toEqual({});
  });

  it('builds a definition without canvas ids', () => {
    expect(toDefinition('designed_x', 'X', [], [canvasStep('a')])).toEqual({
      name: 'designed_x',
      description: 'X',
      form_fields: [],
      steps: [{ step_id: 'm:a', config: {} }],
    });
  });
});

describe('mergeFormFields', () => {
  const field = (name: string, title = ''): WorkflowDesignerFormField => ({ ...DEFAULT_FORM_FIELD, name, title });

  it('adds only fields that are not there yet', () => {
    const merged = mergeFormFields([field('zone', 'Mine')], [field('zone', 'Suggested'), field('note')]);
    expect(merged.map(({ name, title }) => [name, title])).toEqual([
      ['zone', 'Mine'],
      ['note', ''],
    ]);
  });
});

describe('palette filtering', () => {
  const steps = [
    paletteStep({ id: 'designer:log', name: 'Log message', category: 'designer' }),
    paletteStep({ id: 'm:dns', name: 'Update DNS', category: 'tasks' }),
    paletteStep({ id: 'm:state', name: 'Whole state', category: 'tasks', usable: false }),
    paletteStep({ id: 'm:write', name: 'Write sub', category: 'l2vpn', writes_subscription: true }),
  ];
  const noFilter = { search: '', category: '', showUnusable: false, showSubscriptionWriters: false };

  it.each([
    [noFilter, ['designer:log', 'm:dns']],
    [{ ...noFilter, showUnusable: true }, ['designer:log', 'm:dns', 'm:state']],
    [{ ...noFilter, showSubscriptionWriters: true }, ['designer:log', 'm:dns', 'm:write']],
    [{ ...noFilter, search: 'dns' }, ['m:dns']],
    [{ ...noFilter, category: 'designer' }, ['designer:log']],
  ])('filters with %o', (filter, expected) => {
    expect(filterPaletteSteps(steps, filter).map((step) => step.id)).toEqual(expected);
  });

  it('lists categories with the helpers first', () => {
    expect(stepCategories(steps)).toEqual(['designer', 'l2vpn', 'tasks']);
  });
});

describe('withNamePrefix', () => {
  it.each([
    ['report', 'designed_report'],
    ['designed_report', 'designed_report'],
  ])('%s becomes %s', (name, expected) => {
    expect(withNamePrefix(name, 'designed_')).toBe(expected);
  });
});
