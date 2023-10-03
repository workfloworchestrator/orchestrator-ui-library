import React, { FC } from 'react';
import { Step } from '../../../types';
import { EuiCodeBlock } from '@elastic/eui';

export type WFORenderRawJsonProps = {
    steps: Step[];
};

export const WFOStepsRawJson: FC<WFORenderRawJsonProps> = ({ steps }) => {
    const json = JSON.stringify(steps, null, 4);
    return (
        <EuiCodeBlock isCopyable={true} language="json" lineNumbers={true}>
            {json}
        </EuiCodeBlock>
    );
};
