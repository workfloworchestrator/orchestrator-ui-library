import React, { FC, ReactNode } from 'react';

import { EuiCopy } from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoClipboardCopy } from '@/icons/WfoClipboardCopy';

import { getStyles } from './styles';

export type WfoValueCellProps = {
    value: ReactNode;
    textToCopy?: string;
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
        copyIconSize,
        clipboardIconStyle,
        clickable,
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

    return (
        <div css={[getBackgroundColorStyleForRow(rowNumber), valueColumnStyle]}>
            <div css={valueCellStyle}>{valueToRender}</div>
            <div css={clipboardIconStyle}>
                {shouldRenderCopyColumn && (
                    <EuiCopy textToCopy={textToCopy}>
                        {(copy) => (
                            <div onClick={copy} css={clickable}>
                                <WfoClipboardCopy
                                    width={copyIconSize}
                                    height={copyIconSize}
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
