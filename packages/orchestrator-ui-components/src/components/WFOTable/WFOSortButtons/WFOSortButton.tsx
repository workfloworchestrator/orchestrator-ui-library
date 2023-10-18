import React, { FC } from 'react';
import { WFOIconProps } from '../../../icons';
import { useOrchestratorTheme } from '../../../hooks';

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

    return (
        <button
            css={{
                display: 'flex',
                alignItems: 'center',
                cursor: isActive ? 'pointer' : 'not-allowed',
            }}
            onClick={() => isActive && onClick?.()}
        >
            <WFOIconComponent
                color={isActive ? theme.colors.title : theme.colors.lightShade}
            />
        </button>
    );
};
