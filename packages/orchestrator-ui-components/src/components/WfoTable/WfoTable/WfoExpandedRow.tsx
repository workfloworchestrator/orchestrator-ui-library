import { ReactNode } from 'react';

import { WfoTableProps } from './WfoTable';

export type WfoExpandedRowProps<T extends object> = Pick<
    WfoTableProps<T>,
    'rowExpandingConfiguration'
> & {
    rowData: T;
};

export const WfoExpandedRow = <T extends object>({
    rowExpandingConfiguration,
    rowData,
}: WfoExpandedRowProps<T>) => {
    if (!rowExpandingConfiguration) {
        return null;
    }

    return Object.entries(rowExpandingConfiguration.uniqueRowIdToExpandedRowMap)
        .map(([key, value]): [key: string, value: ReactNode] => [
            key.toLowerCase(),
            value,
        ])
        .filter(
            ([key]) =>
                key ===
                (
                    rowData[rowExpandingConfiguration.uniqueRowId] as string
                ).toLowerCase(),
        )
        .map(([, expandedRowComponent]) => expandedRowComponent);
};
