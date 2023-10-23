import React, { FC } from 'react';
import { WFOIconProps } from '../../../icons';
import { useOrchestratorTheme } from '../../../hooks';
import { getStyles } from './styles';

export type WFOSortButtonProps = {
    WFOIconComponent: FC<WFOIconProps>;
    isActive: boolean;
    onClick?: () => void;
};

export const WFOSortButton: FC<WFOSortButtonProps> = ({
    WFOIconComponent,
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
            <WFOIconComponent
                color={isActive ? theme.colors.title : theme.colors.lightShade}
            />
        </button>
    );
};
