import { Table, TableColumns } from './Table';

export type SubscriptionsProps<T> = {
    tableColumns: TableColumns<T>;
    tableData: T[];
};

export const Subscriptions = <T,>(props: SubscriptionsProps<T>) => {
    return <Table data={props.tableData} columns={props.tableColumns}></Table>;
};
