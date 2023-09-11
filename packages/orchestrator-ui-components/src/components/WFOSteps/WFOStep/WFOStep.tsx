import React from 'react';
import { EuiFlexGroup, EuiPanel, EuiText } from '@elastic/eui';
import type { Step } from '../../../types';
import { WFOStepStatusIcon } from '../WFOStepStatusIcon';
export interface WFOStepProps {
    step: Step;
}

export const WFOStep = ({ step }: WFOStepProps) => {
    const { name, executed, status } = step;

    return (
        <EuiPanel>
            <EuiFlexGroup>
                <WFOStepStatusIcon stepStatus={status} />
                <EuiFlexGroup direction="column">
                    <EuiText>{name}</EuiText>
                    <EuiText>
                        {status} - {executed}
                    </EuiText>
                </EuiFlexGroup>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
