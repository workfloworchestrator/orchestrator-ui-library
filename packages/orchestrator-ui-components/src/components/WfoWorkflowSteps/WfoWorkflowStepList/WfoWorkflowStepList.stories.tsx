import type { Meta } from '@storybook/react';

import { Step, StepStatus } from '../../../types';
import { WfoWorkflowStepList } from './WfoWorkflowStepList';

const Story: Meta<typeof WfoWorkflowStepList> = {
  component: WfoWorkflowStepList,
  title: 'Steps/WfoWorkflowStepList',
};
export default Story;

const stepState = JSON.stringify({ stateProp: 'State Value' });

export const stepList: Step[] = [
  {
    name: 'Success step',
    status: StepStatus.SUCCESS,
    stepId: '1',
    executed: '2023-09-04T09:00:00.000000+00:00',
    state: stepState,
  },
  {
    name: 'Running step',
    status: StepStatus.RUNNING,
    stepId: '2',
    executed: '2023-09-04T09:00:01.000000+00:00',
    state: stepState,
  },
  {
    name: 'Failed step',
    status: StepStatus.FAILED,
    stepId: '4',
    executed: '2023-09-04T09:01:00.000000+00:00',
    state: stepState,
  },
  {
    name: 'Suspended step',
    status: StepStatus.SUSPEND,
    stepId: '5',
    executed: '2023-09-04T09:01:00.000000+00:00',
    state: stepState,
  },
  {
    name: 'Pending step',
    status: StepStatus.PENDING,
    stepId: '3',
    executed: '2023-09-04T09:00:10.000000+00:00',
    state: stepState,
  },
];

export const Default = {
  args: {
    steps: stepList,
  },
};
