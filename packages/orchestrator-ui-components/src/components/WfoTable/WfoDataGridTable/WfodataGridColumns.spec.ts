import { SortOrder } from '../../../types';
import { WfoDataSorting } from '../utils/columns';
import {
    WfoDataGridTableColumns,
    getInitialColumnOrder,
    mapColumnSortToEuiDataGridSorting,
} from './WfodataGridColumns';

interface TestColumn {
    id: string;
    title: string;
    date: string;
}

const columns: WfoDataGridTableColumns<TestColumn> = {
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

describe('dataGridColumns', () => {
    describe('getInitialColumnOrder', () => {
        it('returns columns sorted by initialColumnOrder (id, title, date)', () => {
            const initialColumnOrder: Array<keyof TestColumn> = [
                'id',
                'title',
                'date',
            ];

            const result = getInitialColumnOrder(columns, initialColumnOrder);

            expect(result).toEqual([
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

            const result = getInitialColumnOrder(columns, initialColumnOrder);

            expect(result).toEqual([
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
            const sortBy: WfoDataSorting<TestColumn> = {
                field: 'id',
                sortOrder: SortOrder.ASC,
            };
            const onSort = (dataSorting: WfoDataSorting<TestColumn>) => {
                sortBy.field = dataSorting.field;
                sortBy.sortOrder = dataSorting.sortOrder;
            };

            const sorting = mapColumnSortToEuiDataGridSorting(sortBy, onSort);
            expect(sorting.columns).toEqual([{ id: 'id', direction: 'asc' }]);

            sorting.onSort([{ id: 'id', direction: 'desc' }]);
            expect(sortBy).toEqual({ field: 'id', sortOrder: 'DESC' });
        });
    });
});
