import React, { FC } from 'react';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';

export type WFOKeyCellProps = {
    value: string;
    rowNumber: number;
};

export const WFOKeyCell: FC<WFOKeyCellProps> = ({ value, rowNumber }) => {
    const { theme } = useOrchestratorTheme();
    const { keyColumnStyle, getBackgroundColorStyleForRow } = getStyles(theme);

    return (
        <div css={[getBackgroundColorStyleForRow(rowNumber), keyColumnStyle]}>
            <b>{value}</b>
        </div>
    );
};
