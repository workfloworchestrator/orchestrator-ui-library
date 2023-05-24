import React, { FC, ReactNode } from 'react';
import { ChevronDown } from '../../icons/ChevronDown';
import { useOrchestratorTheme } from '../../hooks';

export type TableHeaderCellProps = {
    onClick?: () => void;
    children: ReactNode;
};

export const TableHeaderCell: FC<TableHeaderCellProps> = ({
    children,
    onClick,
}) => {
    const { theme } = useOrchestratorTheme();

    return (
        <div
            css={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            <div>{children}</div>
            <ChevronDown
                color={theme.colors.subduedText}
                height={20}
                width={20}
            />
        </div>
    );
};
