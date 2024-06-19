import React, { ReactNode, useState } from 'react';

import { EuiButtonIcon } from '@elastic/eui';

import {
    WfoBasicTable,
    WfoBasicTableColumns,
    WfoBasicTableColumnsWithControlColumns,
    WfoTableControlColumnConfig,
    getObjectKeys,
    getWfoBasicTableStyles,
    useWithOrchestratorTheme,
} from '@/index';

export type WfoGroupedTableProps<T extends object> = {
    data: Record<string, T[]>;
    columns:
        | WfoBasicTableColumnsWithControlColumns<T>
        | WfoBasicTableColumns<T>;
};

export type GroupType = {
    groupName: string;
};

export const WfoGroupedTable = <T extends object>({
    data,
    columns,
}: WfoGroupedTableProps<T>) => {
    const { expandableTableStyle, dropDownTableStyle } =
        useWithOrchestratorTheme(getWfoBasicTableStyles);

    // EUI uses this Record to show expanded rows in the table. The key is the group name and the value is the component to be rendered in the expanded row
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<
        Record<string, ReactNode>
    >({});
    const updateExpandedRowMap = (key: string) => {
        if (itemIdToExpandedRowMap[key]) {
            const updatedItemIdToExpandedRowMap = {
                ...itemIdToExpandedRowMap,
            };
            delete updatedItemIdToExpandedRowMap[key];
            setItemIdToExpandedRowMap(updatedItemIdToExpandedRowMap);
        } else {
            setItemIdToExpandedRowMap({
                ...itemIdToExpandedRowMap,
                [key]: (
                    <WfoBasicTable
                        data={data[key]}
                        columns={columns}
                        customTableStyle={dropDownTableStyle}
                    />
                ),
            });
        }
    };

    const groups: GroupType[] = getObjectKeys(data).map((key) => ({
        groupName: key,
    }));
    const expandButtonColumn: WfoTableControlColumnConfig<GroupType> = {
        expandButton: {
            field: 'expandButton',
            width: '60px',
            render: (_, { groupName }) => {
                const isExpanded = itemIdToExpandedRowMap[groupName];
                return data[groupName].length > 0 ? (
                    <EuiButtonIcon
                        onClick={() => updateExpandedRowMap(groupName)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        iconType={isExpanded ? 'arrowDown' : 'arrowRight'}
                    />
                ) : (
                    <EuiButtonIcon disabled iconType="arrowRight" />
                );
            },
        },
    };
    const groupNameColumn: WfoBasicTableColumns<GroupType> = {
        groupName: {
            field: 'groupName',
            name: 'Group Name',
        },
    };

    return (
        <WfoBasicTable
            data={groups}
            columns={{ ...expandButtonColumn, ...groupNameColumn }}
            isExpandable={true}
            itemIdToExpandedRowMap={itemIdToExpandedRowMap}
            itemId={groupNameColumn.groupName.field}
            customTableStyle={expandableTableStyle}
        />
    );
};
