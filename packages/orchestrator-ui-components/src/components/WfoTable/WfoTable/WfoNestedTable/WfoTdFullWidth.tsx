import React, { FC, ReactNode } from 'react';

export const FULL_WIDTH_COL_SPAN = 999;

export type WfoTdFullWidthProps = {
    className?: string;
    children: ReactNode;
};

// This component standardizes the definition of a table cell using up all colums available
// It can be applied in table-in-table constructions like the WfoNestedTable
export const WfoTdFullWidth: FC<WfoTdFullWidthProps> = ({
    className,
    children,
}) => (
    <td className={className} colSpan={FULL_WIDTH_COL_SPAN}>
        {children}
    </td>
);
