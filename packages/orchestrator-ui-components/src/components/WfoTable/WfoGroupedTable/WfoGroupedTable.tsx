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

type WfoGroupedTableProps<T extends object> = {
    data: Record<string, T[]>;
    columns:
        | WfoBasicTableColumnsWithControlColumns<T>
        | WfoBasicTableColumns<T>;
};

type GroupType = {
    // todo keyof Record<string, T[]>
    groupName: string;
};

export const WfoGroupedTable = <T extends object>({
    data,
    columns,
}: WfoGroupedTableProps<T>) => {
    const { expandableTableStyle, dropDownTableStyle } =
        useWithOrchestratorTheme(getWfoBasicTableStyles);

    // Expandable config:
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<
        Record<string, ReactNode>
    >({});
    const updateExpandedRowMap = (key: string) => {
        // EUI does not accept key: undefined, it still renders the expanded row
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

    // Outer table:
    const theKeys = getObjectKeys(data);
    const groups: GroupType[] = theKeys.map((key) => ({ groupName: key }));
    const outerColum1: WfoTableControlColumnConfig<GroupType> = {
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
    const outerColum2: WfoBasicTableColumns<GroupType> = {
        groupName: {
            field: 'groupName',
            name: 'Group Name',
        },
    };
    const outerData: GroupType[] = [...groups];

    return (
        <WfoBasicTable
            data={outerData}
            columns={{ ...outerColum1, ...outerColum2 }}
            isExpandable={true}
            itemIdToExpandedRowMap={itemIdToExpandedRowMap}
            itemId={'groupName'}
            customTableStyle={expandableTableStyle}
        />
    );
};
