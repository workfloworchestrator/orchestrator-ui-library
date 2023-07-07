import type { Meta } from '@storybook/react';
import React, { useState } from 'react';
import { DataSorting } from './columns';
import { SortOrder } from '../../types';
import { DataGridTable } from './DataGridTable';

const extractedArr = (arr, start, howMany) =>
    arr.filter((_, index) => {
        return index >= start && index < howMany + start;
    });

const TableWithEvents = (args) => {
    const [data, setData] = useState(
        extractedArr(
            args.data,
            args.pagination.pageIndex,
            args.pagination.pageSize,
        ),
    );
    const [pageSize, setPageSize] = useState(args.pagination.pageSize);
    const [pageIndex, setPageIndex] = useState(args.pagination.pageIndex);
    const [sorting, setSorting] = useState(args.sorting);

    const onChangePage = (updatedPageIndex: number) => {
        const pageI = updatedPageIndex * pageSize;
        setData(extractedArr(args.data, pageI, pageI + pageSize));
        setPageIndex(updatedPageIndex);
    };

    const onChangeItemsPerPage = (updatedPageSize: number) => {
        setData(
            extractedArr(args.data, pageIndex, pageIndex + updatedPageSize),
        );
        setPageSize(updatedPageSize);
    };

    const updateDataSorting = (dataSorting: DataSorting<unknown>) => {
        setSorting(dataSorting);

        const sortData = args.data.sort((a, b) => {
            const aColumn = a[dataSorting.columnId];
            const bColumn = b[dataSorting.columnId];
            if (dataSorting.sortDirection === SortOrder.Asc) {
                return aColumn > bColumn ? 1 : bColumn > aColumn ? -1 : 0;
            }
            return bColumn > aColumn ? 1 : aColumn > bColumn ? -1 : 0;
        });
        setData(extractedArr(sortData, pageIndex, pageIndex + pageSize));
    };
    return (
        <DataGridTable
            {...args}
            data={data}
            pagination={{
                ...args.pagination,
                pageIndex,
                pageSize,
                onChangeItemsPerPage,
                onChangePage,
            }}
            dataSorting={sorting}
            updateDataSorting={updateDataSorting}
        />
    );
};

const Story: Meta<typeof DataGridTable> = {
    component: TableWithEvents,
    title: 'Tables/DataGridTable',
    parameters: { actions: { argTypesRegex: '^on*' } },
};
export default Story;

const columns = {
    id: {
        displayAsText: 'id',
        initialWidth: 100,
    },
    title: {
        displayAsText: 'title',
        initialWidth: 200,
    },
    date: {
        displayAsText: 'date',
        initialWidth: 200,
    },
};

const initialColumnOrder = ['id', 'title', 'date'];

const date = new Date('2023-01-01');
const data = [
    { id: 1, title: 'test 1', date: date.toISOString().split('T')[0] },
];

for (let i = 2; i <= 110; i++) {
    date.setDate(date.getDate() + 1);
    data.push({
        id: i,
        title: `test ${i}`,
        date: date.toISOString().split('T')[0],
    });
}

const pagination = {
    pageSize: 10,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 15, 20, 25, 100],
    totalRecords: data.length,
};

export const Primary = {
    args: {
        data,
        columns,
        initialColumnOrder,
        pagination,
        sorting: {
            columnId: 'id',
            sortDirection: 'ASC',
        },
    },
};

export const Secondary = {
    args: {
        data,
        columns,
        initialColumnOrder,
        pagination,
        sorting: {
            columnId: 'id',
            sortDirection: 'ASC',
        },
    },
};
