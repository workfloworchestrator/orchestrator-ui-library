import { Step, StepDetailLevel, StepImportance, StepPresentation, StepStatus } from '../../types';
import {
  applyPresentationFloor,
  getDefaultStepPresentation,
  getNextPresentationOnClick,
} from './stepPresentationUtils';

const getStep = (status: StepStatus): Step => ({
  name: 'Test step',
  status,
  stepId: '1',
  state: undefined,
  stateDelta: {},
  started: '',
  completed: '',
  createdBy: '',
});

describe('getDefaultStepPresentation()', () => {
  it.each([
    [StepDetailLevel.HIGH, StepImportance.HIGH, StepPresentation.HIGH],
    [StepDetailLevel.HIGH, StepImportance.DEFAULT, StepPresentation.HIGH],
    [StepDetailLevel.HIGH, StepImportance.LOW, StepPresentation.STANDARD],
    [StepDetailLevel.STANDARD, StepImportance.HIGH, StepPresentation.HIGH],
    [StepDetailLevel.STANDARD, StepImportance.DEFAULT, StepPresentation.STANDARD],
    [StepDetailLevel.STANDARD, StepImportance.LOW, StepPresentation.MINIMAL],
    [StepDetailLevel.MINIMAL, StepImportance.HIGH, StepPresentation.STANDARD],
    [StepDetailLevel.MINIMAL, StepImportance.DEFAULT, StepPresentation.MINIMAL],
    [StepDetailLevel.MINIMAL, StepImportance.LOW, StepPresentation.MINIMAL],
  ])('detail level %s with importance %s returns %s', (detailLevel, importance, expected) => {
    expect(getDefaultStepPresentation(importance, detailLevel)).toEqual(expected);
  });

  it('treats a missing importance as default', () => {
    expect(getDefaultStepPresentation(undefined, StepDetailLevel.STANDARD)).toEqual(StepPresentation.STANDARD);
    expect(getDefaultStepPresentation(undefined, StepDetailLevel.MINIMAL)).toEqual(StepPresentation.MINIMAL);
  });

  it('treats an unknown importance as default', () => {
    expect(getDefaultStepPresentation('unknown' as StepImportance, StepDetailLevel.STANDARD)).toEqual(
      StepPresentation.STANDARD,
    );
  });
});

describe('applyPresentationFloor()', () => {
  it('keeps non-minimal presentations unchanged', () => {
    expect(applyPresentationFloor(StepPresentation.HIGH, getStep(StepStatus.FAILED), true, false)).toEqual(
      StepPresentation.HIGH,
    );
  });

  it('shows a failed last step as standard', () => {
    expect(applyPresentationFloor(StepPresentation.MINIMAL, getStep(StepStatus.FAILED), true, false)).toEqual(
      StepPresentation.STANDARD,
    );
  });

  it('keeps a failed step that is not the last step minimal', () => {
    expect(applyPresentationFloor(StepPresentation.MINIMAL, getStep(StepStatus.FAILED), false, false)).toEqual(
      StepPresentation.MINIMAL,
    );
  });

  it('shows a running step as standard', () => {
    expect(applyPresentationFloor(StepPresentation.MINIMAL, getStep(StepStatus.RUNNING), false, false)).toEqual(
      StepPresentation.STANDARD,
    );
  });

  it('shows a suspended step with a user input form as standard', () => {
    expect(applyPresentationFloor(StepPresentation.MINIMAL, getStep(StepStatus.SUSPEND), true, true)).toEqual(
      StepPresentation.STANDARD,
    );
    expect(applyPresentationFloor(StepPresentation.MINIMAL, getStep(StepStatus.SUSPEND), true, false)).toEqual(
      StepPresentation.MINIMAL,
    );
  });

  it('keeps a successful step minimal', () => {
    expect(applyPresentationFloor(StepPresentation.MINIMAL, getStep(StepStatus.SUCCESS), true, false)).toEqual(
      StepPresentation.MINIMAL,
    );
  });
});

describe('getNextPresentationOnClick()', () => {
  it('expands minimal to standard and standard to high', () => {
    expect(getNextPresentationOnClick(StepPresentation.MINIMAL, StepPresentation.MINIMAL)).toEqual(
      StepPresentation.STANDARD,
    );
    expect(getNextPresentationOnClick(StepPresentation.STANDARD, StepPresentation.MINIMAL)).toEqual(
      StepPresentation.HIGH,
    );
  });

  it('shrinks high back to its base presentation', () => {
    expect(getNextPresentationOnClick(StepPresentation.HIGH, StepPresentation.MINIMAL)).toEqual(
      StepPresentation.MINIMAL,
    );
    expect(getNextPresentationOnClick(StepPresentation.HIGH, StepPresentation.STANDARD)).toEqual(
      StepPresentation.STANDARD,
    );
  });

  it('shrinks high to standard when the base presentation is high', () => {
    expect(getNextPresentationOnClick(StepPresentation.HIGH, StepPresentation.HIGH)).toEqual(StepPresentation.STANDARD);
  });

  it('shrinks standard to minimal when the step cannot be expanded to high', () => {
    expect(getNextPresentationOnClick(StepPresentation.STANDARD, StepPresentation.MINIMAL, false)).toEqual(
      StepPresentation.MINIMAL,
    );
  });
});
