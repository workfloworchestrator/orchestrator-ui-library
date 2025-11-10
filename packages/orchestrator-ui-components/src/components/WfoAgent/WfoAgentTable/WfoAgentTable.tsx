import React from 'react';

import { EuiBasicTable, EuiBasicTableColumn } from '@elastic/eui';

import { AggregationResult, AggregationResultsData } from '@/types';

export type WfoAgentTableProps = {
    aggregationData: AggregationResultsData;
};

const formatColumnName = (key: string) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

export function WfoAgentTable({ aggregationData }: WfoAgentTableProps) {
    const { results } = aggregationData;
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(5);

    const columns: EuiBasicTableColumn<AggregationResult>[] =
        React.useMemo(() => {
            if (results.length === 0) return [];

            const firstResult = results[0];
            const groupKeys = Object.keys(firstResult.group_values);
            const aggKeys = Object.keys(firstResult.aggregations);

            const groupColumns: EuiBasicTableColumn<AggregationResult>[] =
                groupKeys.map((key) => ({
                    field: 'group_values' as keyof AggregationResult,
                    name: formatColumnName(key),
                    render: (_: unknown, record: AggregationResult) =>
                        record.group_values[key],
                }));

            const aggColumns: EuiBasicTableColumn<AggregationResult>[] =
                aggKeys.map((key) => ({
                    field: 'aggregations' as keyof AggregationResult,
                    name: formatColumnName(key),
                    render: (_: unknown, record: AggregationResult) =>
                        record.aggregations[key],
                }));

            return [...groupColumns, ...aggColumns];
        }, [results]);

    const startIndex = pageIndex * pageSize;
    const paginatedItems = results.slice(startIndex, startIndex + pageSize);

    const pagination = {
        pageIndex,
        pageSize,
        totalItemCount: results.length,
        pageSizeOptions: [5, 10, 25, 50],
    };

    const onTableChange = ({
        page,
    }: {
        page?: { index: number; size: number };
    }) => {
        if (page) {
            setPageIndex(page.index);
            setPageSize(page.size);
        }
    };

    return (
        <EuiBasicTable
            items={paginatedItems}
            columns={columns}
            tableLayout="auto"
            pagination={pagination}
            onChange={onTableChange}
        />
    );
}
