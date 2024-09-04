import React, { ReactNode, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon } from '@elastic/eui';

import {
    ColumnType,
    WfoTable,
    WfoTableColumnConfig,
    WfoTableProps,
} from '../WfoTable';
import { WIDTH_BUTTON_COLUMN } from './constants';

export type WfoNestedTable<T extends object> = Pick<
    WfoTableProps<T>,
    | 'isLoading'
    | 'data'
    | 'columnConfig'
    | 'dataSorting'
    | 'onUpdateDataSorting'
> & {
    uniqueRowId: keyof WfoTableColumnConfig<T>;
    children: (row: T) => React.ReactNode;
};

export const WfoNestedTable = <T extends object>({
    data,
    columnConfig,
    dataSorting,
    uniqueRowId,
    isLoading,
    onUpdateDataSorting,
    children,
}: WfoNestedTable<T>) => {
    const t = useTranslations('wfoComponents');

    const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);
    const toggleExpandedRow = (groupName: string) => {
        setExpandedRowIds((prevState) => {
            // Collapse group
            if (prevState.includes(groupName)) {
                return prevState.filter((value) => value !== groupName);
            }

            // Expand group
            return [...prevState, groupName];
        });
    };

    const uniqueRowIdToExpandedRowMap = expandedRowIds.reduce<
        Record<string, ReactNode>
    >((accumulator, groupName) => {
        const dataRow: T | undefined = data.find(
            (row) => row[uniqueRowId] === groupName,
        );
        if (dataRow) {
            accumulator[groupName] = children(dataRow);
        }

        return accumulator;
    }, {});

    const expandButtonColumn: WfoTableColumnConfig<T> = {
        expandButton: {
            columnType: ColumnType.CONTROL,
            width: WIDTH_BUTTON_COLUMN,
            renderControl: (row) => {
                const indexKey = row[uniqueRowId];
                const isExpanded = uniqueRowIdToExpandedRowMap.hasOwnProperty(
                    indexKey?.toString() ?? '',
                );

                return indexKey ? (
                    <EuiButtonIcon
                        onClick={() => toggleExpandedRow(indexKey.toString())}
                        aria-label={isExpanded ? t('collapse') : t('expand')}
                        iconType={isExpanded ? 'arrowDown' : 'arrowRight'}
                    />
                ) : (
                    <EuiButtonIcon
                        disabled
                        iconType="arrowRight"
                        aria-label={t('expanded')}
                    />
                );
            },
        },
    };

    return (
        <WfoTable
            data={data}
            columnConfig={{ ...expandButtonColumn, ...columnConfig }}
            dataSorting={dataSorting}
            onUpdateDataSorting={onUpdateDataSorting}
            isLoading={isLoading}
            rowExpandingConfiguration={{
                uniqueRowId,
                uniqueRowIdToExpandedRowMap,
            }}
        />
    );
};
