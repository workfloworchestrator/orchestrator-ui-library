import React from 'react';

import {
    WfoAdvancedTableColumnConfig,
    WfoAdvancedTableDataColumnConfigItem,
} from '@/components/WfoTable/WfoAdvancedTable/types';
import {
    ColumnType,
    WfoTableControlColumnConfigItem,
} from '@/components/WfoTable/WfoTable';
import { getTypedFieldFromObject } from '@/utils';

export const getRowDetailData = <T extends object>(
    selectedDataForDetailModal: T,
    tableColumnConfig: WfoAdvancedTableColumnConfig<T>,
) => {
    const tableColumnConfigEntries: [
        string,
        (
            | WfoTableControlColumnConfigItem<T>
            | WfoAdvancedTableDataColumnConfigItem<T, keyof T>
        ),
    ][] = Object.entries(tableColumnConfig);

    const dataColumnEntries = tableColumnConfigEntries.filter(
        ([, tableColumnConfig]) =>
            tableColumnConfig.columnType === ColumnType.DATA,
    ) as [string, WfoAdvancedTableDataColumnConfigItem<T, keyof T>][];

    return dataColumnEntries.map(([key, value]) => {
        const dataField = getTypedFieldFromObject(key, tableColumnConfig);
        if (dataField === null) {
            return {
                key,
                value: undefined,
            };
        }

        const { renderDetails, renderData, clipboardText, label } = value;
        const dataValue = selectedDataForDetailModal[dataField];

        return {
            key: label ?? dataField.toString(),
            value: (renderDetails &&
                renderDetails(dataValue, selectedDataForDetailModal)) ??
                (renderData &&
                    renderData(dataValue, selectedDataForDetailModal)) ?? (
                    <>{dataValue}</>
                ),
            textToCopy:
                clipboardText?.(dataValue, selectedDataForDetailModal) ??
                (typeof dataValue === 'string' ? dataValue : undefined),
        };
    });
};
