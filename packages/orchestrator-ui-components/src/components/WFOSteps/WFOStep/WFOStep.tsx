import React from 'react';
import { EuiPanel } from '@elastic/eui';
import type { Step } from '../../../types';

export interface WFOStepProps {
    step: Step;
}

export const WFOStep = ({ step }: WFOStepProps) => {
    console.log(step);
    const { name } = step;

    return <EuiPanel>{name}</EuiPanel>;
};
