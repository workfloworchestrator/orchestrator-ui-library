import React, { FC, ReactNode } from 'react';

import { EuiButtonIcon } from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoMinusCircleFill, WfoPlusCircleFill } from '@/icons';

import { getStyles } from './styles';

export type WfoExpandableFieldProps = {
    isExpanded: boolean;
    title: ReactNode;
    onExpandedChange: (isExpanded: boolean) => void;
    children: ReactNode;
};

export const WfoExpandableField: FC<WfoExpandableFieldProps> = ({
    isExpanded,
    title,
    onExpandedChange,
    children,
}) => {
    const { theme } = useOrchestratorTheme();
    const { titleRowStyle, titleStyle } = useWithOrchestratorTheme(getStyles);

    return (
        <>
            <div css={titleRowStyle}>
                <EuiButtonIcon
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    iconType={() =>
                        isExpanded ? (
                            <WfoMinusCircleFill color={theme.colors.primary} />
                        ) : (
                            <WfoPlusCircleFill color={theme.colors.primary} />
                        )
                    }
                    onClick={() => onExpandedChange(!isExpanded)}
                />
                <div css={titleStyle}>{title}</div>
            </div>

            {isExpanded && children}
        </>
    );
};
