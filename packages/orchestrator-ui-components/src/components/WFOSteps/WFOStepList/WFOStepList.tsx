import React from 'react';

import { EuiComment, EuiText, EuiAvatar, EuiCode } from '@elastic/eui';
import { Step } from '../../../types';

export interface WFOStepListProps {
  steps: Step[]
};

export const WFOStepList = ({
  steps 
}: WFOStepListProps) => {
  console.log(steps)
  return (
    <div>
      {steps.map(step => (
        <div key={step.stepid}>{step.status}</div>
      ))
  }
    </div>
  )
}

