import React, { FC } from 'react';

import { EuiText } from '@elastic/eui';

import { getStyles } from './styles';
import { useOrchestratorTheme } from '../../hooks';

export type WfoKeyCellProps = {
    value: string;
    rowNumber: number;
};

export const WfoKeyCell: FC<WfoKeyCellProps> = ({ value, rowNumber }) => {
    const { theme } = useOrchestratorTheme();
    const { keyColumnStyle, keyCellStyle, getBackgroundColorStyleForRow } =
        getStyles(theme);

    return (
        <div css={[getBackgroundColorStyleForRow(rowNumber), keyColumnStyle]}>
            <EuiText css={keyCellStyle} size="s">
                {value}
            </EuiText>
        </div>
    );
};
