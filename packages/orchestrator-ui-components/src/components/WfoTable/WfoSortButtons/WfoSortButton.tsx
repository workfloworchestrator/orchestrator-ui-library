import React, { FC } from 'react';

import { useOrchestratorTheme } from '../../../hooks';
import { WfoIconProps } from '../../../icons';
import { getStyles } from './styles';

export type WfoSortButtonProps = {
    WfoIconComponent: FC<WfoIconProps>;
    isActive: boolean;
    onClick?: () => void;
};

export const WfoSortButton: FC<WfoSortButtonProps> = ({
    WfoIconComponent,
    isActive,
    onClick,
}) => {
    const { theme } = useOrchestratorTheme();
    const { getSortButtonStyle } = getStyles();

    return (
        <button
            css={getSortButtonStyle(isActive)}
            onClick={() => isActive && onClick?.()}
        >
            <WfoIconComponent
                color={isActive ? theme.colors.title : theme.colors.lightShade}
            />
        </button>
    );
};
