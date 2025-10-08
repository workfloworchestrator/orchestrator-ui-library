import React, { FC, ReactNode } from 'react';

import { EuiCopy } from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoClipboardCopy } from '@/icons/WfoClipboardCopy';

import { getStyles } from './styles';

export type WfoValueCellProps = {
    value: ReactNode;
    textToCopy?: string | object;
    rowNumber: number;
    enableCopyIcon: boolean;
};

export const WfoValueCell: FC<WfoValueCellProps> = ({
    value,
    textToCopy,
    rowNumber,
    enableCopyIcon,
}) => {
    const { theme } = useOrchestratorTheme();
    const {
        clipboardIconSize,
        clipboardIconStyle,
        clickableStyle,
        getBackgroundColorStyleForRow,
        valueColumnStyle,
        valueCellStyle,
    } = useWithOrchestratorTheme(getStyles);

    const shouldRenderCopyColumn = enableCopyIcon && textToCopy;

    const valueToRender =
        typeof value === 'string' ||
        typeof value === 'number' ||
        React.isValidElement(value)
            ? value
            : JSON.stringify(value);

    const copyText =
        typeof textToCopy === 'object'
            ? JSON.stringify(textToCopy)
            : textToCopy;

    return (
        <div css={[getBackgroundColorStyleForRow(rowNumber), valueColumnStyle]}>
            <div css={valueCellStyle}>{valueToRender}</div>
            <div css={clipboardIconStyle}>
                {shouldRenderCopyColumn && (
                    <EuiCopy textToCopy={copyText || ''}>
                        {(copy) => (
                            <div onClick={copy} css={clickableStyle}>
                                <WfoClipboardCopy
                                    width={clipboardIconSize}
                                    height={clipboardIconSize}
                                    color={theme.colors.mediumShade}
                                />
                            </div>
                        )}
                    </EuiCopy>
                )}
            </div>
        </div>
    );
};
