import { Step, StepStatus } from '../../types';
import { GroupedStep } from './WfoProcessDetailPage';
import {
  convertStepsToGroupedSteps,
  getMostAccurateTimelineStatus,
  mapGroupedStepsToTimelineItems,
} from './timelineUtils';

const baseStep: Step = {
  started: 'testStarted',
  completed: 'testCompleted',
  name: 'tesName',
  state: {
    testKey: 'testValue',
  },
  stateDelta: {
    testKey: 'testValue',
  },
  status: StepStatus.SUCCESS,
  stepId: 'testStepId',
};

describe('getMostAccurateTimelineStatus()', () => {
  it('returns previous step when current step has status PENDING', () => {
    const previousStepStatus = StepStatus.COMPLETE;
    const currentStepStatus = StepStatus.PENDING;

    const result = getMostAccurateTimelineStatus(previousStepStatus, currentStepStatus);

    expect(result).toEqual(previousStepStatus);
  });

  it('returns the current step when current step has a status other than PENDING', () => {
    const previousStepStatus = StepStatus.FAILED;
    const currentStepStatus = StepStatus.COMPLETE;

    const result = getMostAccurateTimelineStatus(previousStepStatus, currentStepStatus);

    expect(result).toEqual(currentStepStatus);
  });
});

describe('convertStepsToGroupedSteps()', () => {
  it('returns steps grouped by name', () => {
    // Given
    const testSteps: Step[] = [
      {
        ...baseStep,
        name: 'testName1',
        status: StepStatus.FAILED,
      },
      {
        ...baseStep,
        name: 'testName1',
        status: StepStatus.SUCCESS,
      },
      {
        ...baseStep,
        name: 'testName2',
        status: StepStatus.PENDING,
      },
    ];

    // When
    const result = convertStepsToGroupedSteps(testSteps);

    // Then
    expect(result.length).toEqual(2);

    const { steps: firstGroupedStepSteps } = result[0];
    expect(firstGroupedStepSteps.length).toEqual(2);
    expect(firstGroupedStepSteps[0].name).toEqual('testName1');
    expect(firstGroupedStepSteps[0].status).toEqual(StepStatus.FAILED);
    expect(firstGroupedStepSteps[1].name).toEqual('testName1');
    expect(firstGroupedStepSteps[1].status).toEqual(StepStatus.SUCCESS);

    const { steps: secondGroupedStepSteps } = result[1];
    expect(secondGroupedStepSteps.length).toEqual(1);
    expect(secondGroupedStepSteps[0].name).toEqual('testName2');
    expect(secondGroupedStepSteps[0].status).toEqual(StepStatus.PENDING);
  });
  it('returns an empty array if there are no steps', () => {
    const result = convertStepsToGroupedSteps([]);

    expect(result.length).toEqual(0);
  });
});

describe('getMostAccurateTimelineStatus()', () => {
  it('returns previous step when current step has status PENDING', () => {
    const statusPreviousStep: StepStatus = StepStatus.FAILED;
    const statusCurrentStep: StepStatus = StepStatus.PENDING;

    const result = getMostAccurateTimelineStatus(statusPreviousStep, statusCurrentStep);

    expect(result).toEqual(statusPreviousStep);
  });
  it('returns the current step when current step has a status other than PENDING', () => {
    const statusPreviousStep: StepStatus = StepStatus.FAILED;
    const statusCurrentStep: StepStatus = StepStatus.SUCCESS;

    const result = getMostAccurateTimelineStatus(statusPreviousStep, statusCurrentStep);

    expect(result).toEqual(statusCurrentStep);
  });
});

describe('mapGroupedStepsToTimelineItems()', () => {
  it('maps a grouped-step with a single step to a timeline item', () => {
    // Given
    const groupedSteps: GroupedStep[] = [
      {
        steps: [baseStep],
      },
    ];

    // When
    const result = mapGroupedStepsToTimelineItems(groupedSteps);

    // Then
    expect(result.length).toEqual(1);

    const { processStepStatus, stepDetail, id, value } = result[0];
    expect(processStepStatus).toEqual(baseStep.status);
    expect(stepDetail).toEqual(baseStep.name);
    expect(id).toEqual(baseStep.stepId);
    expect(value).toBeUndefined();
  });

  it('maps a grouped-step with a multiple steps to a single timeline item', () => {
    // Given
    const testStep1: Step = {
      ...baseStep,
      status: StepStatus.FAILED,
      stepId: '111',
    };
    const testStep2: Step = {
      ...baseStep,
      status: StepStatus.FAILED,
      stepId: '222',
    };
    const testStep3: Step = {
      ...baseStep,
      status: StepStatus.SUCCESS,
      stepId: '333',
    };
    const groupedSteps: GroupedStep[] = [
      {
        steps: [testStep1, testStep2, testStep3],
      },
    ];

    // When
    const result = mapGroupedStepsToTimelineItems(groupedSteps);

    // Then
    expect(result.length).toEqual(1);

    const { processStepStatus, stepDetail, id, value } = result[0];
    expect(processStepStatus).toEqual(StepStatus.SUCCESS);
    expect(stepDetail).toEqual(testStep3.name);
    expect(id).toEqual(testStep3.stepId);
    expect(value).toEqual(2);
  });

  it('returns an timeline item with value undefined if there are multiple non-failed steps', () => {
    // Given
    const testStep1: Step = {
      ...baseStep,
      status: StepStatus.PENDING,
      stepId: '111',
    };
    const testStep2: Step = {
      ...baseStep,
      status: StepStatus.SUCCESS,
      stepId: '222',
    };
    const groupedSteps: GroupedStep[] = [
      {
        steps: [testStep1, testStep2],
      },
    ];

    // When
    const result = mapGroupedStepsToTimelineItems(groupedSteps);

    // Then
    expect(result.length).toEqual(1);
    expect(result[0].value).toBeUndefined();
  });
});
