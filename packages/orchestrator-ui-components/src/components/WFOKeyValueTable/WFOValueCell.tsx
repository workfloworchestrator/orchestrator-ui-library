import React, { FC, ReactNode } from 'react';
import { useOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';
import { EuiCopy } from '@elastic/eui';
import { WFOClipboardCopy } from '../../icons/WFOClipboardCopy';

export type WFOValueCellProps = {
    value: ReactNode;
    plainTextValue?: string;
    rowNumber: number;
    enableCopyIcon: boolean;
};

export const WFOValueCell: FC<WFOValueCellProps> = ({
    value,
    plainTextValue,
    rowNumber,
    enableCopyIcon,
}) => {
    const { theme } = useOrchestratorTheme();
    const {
        valueColumnStyle,
        clipboardIconStyle,
        clickable,
        getBackgroundColorStyleForRow,
    } = getStyles(theme);

    const shouldRenderCopyColumn = enableCopyIcon && plainTextValue;

    return (
        <div css={[getBackgroundColorStyleForRow(rowNumber), valueColumnStyle]}>
            <div>{value}</div>
            <div css={clipboardIconStyle}>
                {shouldRenderCopyColumn && (
                    <EuiCopy textToCopy={plainTextValue}>
                        {(copy) => (
                            <div onClick={copy} css={clickable}>
                                <WFOClipboardCopy
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
