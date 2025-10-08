import React, { FC } from 'react';

import { EuiCopy } from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoClipboardCopy } from '@/icons/WfoClipboardCopy';
import { getFirstUuidPart } from '@/utils';

import { COPY_ICON_CLASS, getStyles } from './styles';

export type WfoFirstUUIDPartProps = {
    UUID: string;
    showCopyIcon?: boolean;
};

export const WfoFirstPartUUID: FC<WfoFirstUUIDPartProps> = ({
    UUID,
    showCopyIcon = true,
}) => {
    const { uuidFieldStyle, clickable } = useWithOrchestratorTheme(getStyles);
    const { theme } = useOrchestratorTheme();

    return (
        <span css={uuidFieldStyle}>
            {getFirstUuidPart(UUID)}
            {showCopyIcon && (
                <EuiCopy textToCopy={UUID}>
                    {(copy) => (
                        <div
                            className={COPY_ICON_CLASS}
                            onClick={copy}
                            css={clickable}
                        >
                            <WfoClipboardCopy
                                width={16}
                                height={16}
                                color={theme.colors.mediumShade}
                            />
                        </div>
                    )}
                </EuiCopy>
            )}
        </span>
    );
};
