import { ReactNode } from 'react';

import {
    WfoTableControlColumnConfig,
    WfoTableControlColumnConfigItem,
    WfoTableDataColumnConfigItem,
} from '@/components/WfoTable/WfoTable';

export type WfoAdvancedTableDataColumnConfigItem<
    T extends object,
    Property extends keyof T,
> = WfoTableDataColumnConfigItem<T, Property> & {
    renderDetails?: (cellValue: T[Property], row: T) => ReactNode;
    clipboardText?: (cellValue: T[Property], row: T) => string;
};
export type WfoAdvancedTableDataColumnConfig<T extends object> = {
    [Property in keyof T]:
        | WfoAdvancedTableDataColumnConfigItem<T, Property>
        | WfoTableControlColumnConfigItem<T>;
};
export type WfoAdvancedTableColumnConfig<T extends object> = Partial<
    WfoTableControlColumnConfig<T> | WfoAdvancedTableDataColumnConfig<T>
>;
