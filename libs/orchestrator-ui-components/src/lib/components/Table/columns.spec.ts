import {
    getInitialColumnOrder,
    columnSortToEuiDataGridSorting,
    TableColumns,
    SortDirection,
    DataSorting,
} from './columns';

interface TestColumn {
    id: string;
    title: string;
    date: string;
}

const columns: TableColumns<TestColumn> = {
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

describe('columns', () => {
    describe('getInitialColumnOrder', () => {
        it('should return columns sorted by initialColumnOrder (id, title, date)', () => {
            const initialColumnOrder: Array<keyof TestColumn> = [
                'id',
                'title',
                'date',
            ];
            const initials = getInitialColumnOrder(columns, initialColumnOrder);
            expect(initials).toEqual([
                {
                    displayAsText: 'id',
                    id: 'id',
                    initialWidth: 100,
                    isExpandable: false,
                },
                {
                    displayAsText: 'title',
                    id: 'title',
                    initialWidth: 200,
                    isExpandable: false,
                },
                {
                    displayAsText: 'date',
                    id: 'date',
                    initialWidth: 200,
                    isExpandable: false,
                },
            ]);
        });

        it('should return columns sorted by (date, id, title)', () => {
            const initialColumnOrder: Array<keyof TestColumn> = [
                'date',
                'id',
                'title',
            ];
            const initials = getInitialColumnOrder(columns, initialColumnOrder);
            expect(initials).toEqual([
                {
                    displayAsText: 'date',
                    id: 'date',
                    initialWidth: 200,
                    isExpandable: false,
                },
                {
                    displayAsText: 'id',
                    id: 'id',
                    initialWidth: 100,
                    isExpandable: false,
                },
                {
                    displayAsText: 'title',
                    id: 'title',
                    initialWidth: 200,
                    isExpandable: false,
                },
            ]);
        });
    });

    describe('columnSortToEuiDataGridSorting', () => {
        it('should return sort dict with columns and onsort', () => {
            const sortBy: DataSorting<TestColumn> = {
                columnId: 'id',
                sortDirection: SortDirection.Asc,
            };
            const onSort = (dataSorting: DataSorting<TestColumn>) => {
                sortBy.columnId = dataSorting.columnId;
                sortBy.sortDirection = dataSorting.sortDirection;
            };

            const sorting = columnSortToEuiDataGridSorting(sortBy, onSort);
            expect(sorting.columns).toEqual([{ id: 'id', direction: 'asc' }]);
            sorting.onSort([{ id: 'id', direction: 'desc' }]);
            expect(sortBy).toEqual({ columnId: 'id', sortDirection: 'DESC' });
        });
    });
});
