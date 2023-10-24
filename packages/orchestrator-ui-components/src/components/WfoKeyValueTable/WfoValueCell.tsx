import React, { FC, ReactNode } from 'react';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';
import { EuiCopy } from '@elastic/eui';
import { WfoClipboardCopy } from '../../icons/WfoClipboardCopy';

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
        valueColumnStyle,
        valueCellStyle,
        clipboardIconStyle,
        clickable,
        getBackgroundColorStyleForRow,
    } = getStyles(theme);

    const shouldRenderCopyColumn = enableCopyIcon && textToCopy;

    return (
        <div css={[getBackgroundColorStyleForRow(rowNumber), valueColumnStyle]}>
            <div css={valueCellStyle}>{value}</div>
            <div css={clipboardIconStyle}>
                {shouldRenderCopyColumn && (
                    <EuiCopy textToCopy={textToCopy}>
                        {(copy) => (
                            <div onClick={copy} css={clickable}>
                                <WfoClipboardCopy
                                    width={16}
                                    height={16}
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
