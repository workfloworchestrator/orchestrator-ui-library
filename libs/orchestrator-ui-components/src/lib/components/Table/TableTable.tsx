import { EuiBasicTable } from '@elastic/eui';
import { EuiBasicTableColumn } from '@elastic/eui';
import { Pagination } from '@elastic/eui';
import { Criteria } from '@elastic/eui/src/components/basic_table/basic_table';

// Adds extra prop
// export type TableTableColumns<T> = {
//     [Property in keyof T]: EuiBasicTableColumn<T> & {
//         isHidden?: boolean;
//     };
// };

export type TableTableProps<T> = {
    data: T[];
    columns: EuiBasicTableColumn<T>[];
    pagination: Pagination;
    onCriteriaChange: (criteria: Criteria<T>) => void;
};

export const TableTable = <T,>({
    data,
    columns,
    pagination,
    onCriteriaChange,
}: TableTableProps<T>) => {
    return (
        <EuiBasicTable
            tableCaption="Demo of EuiBasicTable"
            items={data}
            rowHeader="firstName"
            columns={columns}
            pagination={pagination}
            onChange={onCriteriaChange}
        />
    );
};
