import type { Meta } from '@storybook/react';
import { WFOStepList } from './WFOStepList';
import { StepStatus } from '../../../types';

const Story: Meta<typeof WFOStepList> = {
    component: WFOStepList,
    title: 'Steps/WFOStepList',
};
export default Story;

const stepState = JSON.stringify({stateProp: 'State Value'})

export const Default = {
  args: {
    steps: [{
      name: 'Success step',
      status: StepStatus.SUCCESS,
      stepid: '1',
      executed: '2023-09-04T09:00:00.000000+00:00',
      state: stepState
    },{
      name: 'Running step',
      status: StepStatus.RUNNING,
      stepid: '2',
      executed: '2023-09-04T09:00:01.000000+00:00',
      state: stepState
    },{
      name: 'Pending step',
      status: StepStatus.PENDING,
      stepid: '3',
      executed: '2023-09-04T09:00:10.000000+00:00',
      state: stepState
    },{
      name: 'Failed step',
      status: StepStatus.FAILED,
      stepid: '4',
      executed: '2023-09-04T09:01:00.000000+00:00',
      state: stepState
    },
  ]}
};
