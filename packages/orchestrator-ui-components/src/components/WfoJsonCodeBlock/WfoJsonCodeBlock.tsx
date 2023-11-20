import React, { FC } from 'react';

import { EuiCodeBlock } from '@elastic/eui';

import { useWithOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';

export type WfoJsonCodeBlockProps = {
    data: object;
};

export const WfoJsonCodeBlock: FC<WfoJsonCodeBlockProps> = ({ data }) => {
    const { euiCodeBlockStyle } = useWithOrchestratorTheme(getStyles);

    const json = JSON.stringify(data, null, 4);

    return (
        <EuiCodeBlock
            css={euiCodeBlockStyle}
            isCopyable={true}
            language="json"
            lineNumbers={true}
        >
            {json}
        </EuiCodeBlock>
    );
};
