import { mapProcessStepsToTimelineItems } from './timelineUtils';
import { ProcessDetailStep, StepStatus } from '../../types';

describe('mapProcessStepsToTimelineItems()', () => {
    it('merges two steps with the same name given the first step is not a final status', () => {
        const steps: ProcessDetailStep[] = [
            {
                status: StepStatus.FAILED,
                name: 'testName',
            } as ProcessDetailStep,
            {
                status: StepStatus.COMPLETE,
                name: 'testName',
            } as ProcessDetailStep,
        ];

        const result = mapProcessStepsToTimelineItems(steps);

        expect(result.length).toEqual(1);
        expect(result[0].value).toEqual(2);
        expect(result[0].processStepStatus).toEqual(StepStatus.COMPLETE);
    });

    it('merges three steps with the same name given none of the steps have a final status', () => {
        const steps: ProcessDetailStep[] = [
            {
                status: StepStatus.FAILED,
                name: 'testName',
            } as ProcessDetailStep,
            {
                status: StepStatus.FAILED,
                name: 'testName',
            } as ProcessDetailStep,
            {
                status: StepStatus.FAILED,
                name: 'testName',
            } as ProcessDetailStep,
        ];

        const result = mapProcessStepsToTimelineItems(steps);

        expect(result.length).toEqual(1);
        expect(result[0].value).toEqual(3);
        expect(result[0].processStepStatus).toEqual(StepStatus.FAILED);
    });

    it('does not merge the two steps with the same name given the first step is a final status', () => {
        const steps: ProcessDetailStep[] = [
            {
                status: StepStatus.SKIPPED,
                name: 'testName',
            } as ProcessDetailStep,
            {
                status: StepStatus.COMPLETE,
                name: 'testName',
            } as ProcessDetailStep,
        ];

        const result = mapProcessStepsToTimelineItems(steps);

        expect(result.length).toEqual(2);
        expect(result[0].processStepStatus).toEqual(StepStatus.SKIPPED);
        expect(result[1].processStepStatus).toEqual(StepStatus.COMPLETE);
    });
});
