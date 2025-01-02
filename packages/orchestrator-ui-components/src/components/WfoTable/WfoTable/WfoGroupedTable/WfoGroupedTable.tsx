import React, { FC, ReactElement } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButtonEmpty, EuiFlexGroup, EuiSpacer } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

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
    overrideHeaderSection?: (ExpandButton: ReactElement) => React.ReactNode;
};

export const WfoGroupedTable = <T extends object>({
    data,
    columnConfig,
    groupNameLabel,
    isLoading,
    overrideHeaderSection,
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

    const ExpandCollapseButton: FC = () => (
        <EuiButtonEmpty
            size="xs"
            onClick={() =>
                isAllGroupsAndSubgroupsExpanded
                    ? collapseAllRows()
                    : expandAllRows()
            }
        >
            {isAllGroupsAndSubgroupsExpanded ? t('collapse') : t('expand')}
        </EuiButtonEmpty>
    );

    return (
        <>
            <EuiFlexGroup justifyContent="flexEnd">
                {overrideHeaderSection ? (
                    overrideHeaderSection(<ExpandCollapseButton />)
                ) : (
                    <ExpandCollapseButton />
                )}
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
