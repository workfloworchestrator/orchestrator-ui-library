import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonEmpty, EuiFlexGroup, EuiSpacer } from '@elastic/eui';
import { useWithOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

import { WfoTable, WfoTableProps } from '../WfoTable';
import { getWfoTableStyles } from '../styles';
import { useGroupedTableConfig } from './useGroupedTableConfig';

export type GroupType = {
    groupName: string;
};

export type GroupedData<T> = {
    [Key: string]: T[] | GroupedData<T>;
};

export type WfoGroupedTableProps<T extends object> = Pick<
    WfoTableProps<T>,
    'columnConfig' | 'isLoading' | 'className'
> & {
    data: GroupedData<T>;
    groupNameLabel: string;
};

export const WfoGroupedTable = <T extends object>({
    data,
    columnConfig,
    groupNameLabel,
    isLoading,
    className,
}: WfoGroupedTableProps<T>) => {
    const { headerStyle, rowStyle, cellStyle } =
        useWithOrchestratorTheme(getWfoTableStyles);

    const t = useTranslations('wfoComponents.wfoGroupedTable');

    const {
        groups,
        groupColumnConfig,
        numberOfColumnsInnerTable,
        uniqueRowIdToExpandedRowMap,
        isAllGroupsAndSubgroupsExpanded,
        toggleExpandedRow,
        expandAllRows,
        collapseAllRows,
    } = useGroupedTableConfig({
        data,
        groupNameLabel,
        columnConfig,
    });

    return (
        <>
            <EuiFlexGroup justifyContent="flexEnd">
                <EuiButtonEmpty
                    size="xs"
                    onClick={() =>
                        isAllGroupsAndSubgroupsExpanded
                            ? collapseAllRows()
                            : expandAllRows()
                    }
                >
                    {isAllGroupsAndSubgroupsExpanded
                        ? t('collapse')
                        : t('expand')}
                </EuiButtonEmpty>
            </EuiFlexGroup>

            <EuiSpacer size="xs" />

            <WfoTable
                className={className}
                data={groups}
                columnConfig={groupColumnConfig}
                isLoading={isLoading}
                overrideHeader={() => (
                    <thead css={headerStyle}>
                        <tr css={rowStyle}>
                            <th
                                colSpan={numberOfColumnsInnerTable}
                                css={cellStyle}
                            >
                                {groupNameLabel}
                            </th>
                        </tr>
                    </thead>
                )}
                rowExpandingConfiguration={{
                    uniqueRowId: 'groupName',
                    uniqueRowIdToExpandedRowMap,
                }}
                onRowClick={({ groupName }) => toggleExpandedRow(groupName)}
            />
        </>
    );
};
