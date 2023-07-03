import {
    CheckmarkCircleFill,
    DataSorting,
    DEFAULT_PAGE_SIZES,
    determineNewSortOrder,
    determinePageIndex,
    getTypedFieldFromObject,
    MinusCircleOutline,
    parseDate,
    PlusCircleFill,
    getFirstUuidPart,
    SubscriptionStatusBadge,
    Table,
    TableColumns,
    TableColumnsWithExtraNonDataFields,
    useOrchestratorTheme,
    useStringQueryWithGraphql,
    parseDateToLocaleString,
    Loading,
    mapEsQueryContainerToKeyValueTuple,
    isValidQueryPart,
    SearchField,
    TableSettingsModal,
    ColumnConfig,
    TableColumnConfig,
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSearchBar,
    EuiSpacer,
} from '@elastic/eui';
import {
    DESCRIPTION,
    END_DATE,
    GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
    GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT,
    INSYNC,
    NOTE,
    PRODUCT_NAME,
    START_DATE,
    STATUS,
    SUBSCRIPTION_ID,
    SubscriptionsQueryVariables,
    SubscriptionsResult,
    SubscriptionsSort,
    TAG,
} from './subscriptionQuery';
import { Criteria, Pagination } from '@elastic/eui';

const COLUMN_LABEL_ID = 'ID';
const COLUMN_LABEL_DESCRIPTION = 'Description';
const COLUMN_LABEL_STATUS = 'Status';
const COLUMN_LABEL_INSYNC = 'In Sync';
const COLUMN_LABEL_PRODUCT = 'Product';
const COLUMN_LABEL_TAG = 'Tag';
const COLUMN_LABEL_START_DATE = 'Start Date';
const COLUMN_LABEL_END_DATE = 'End Date';
const COLUMN_LABEL_NOTE = 'Note';

const FIELD_NAME_INLINE_SUBSCRIPTION_DETAILS = 'inlineSubscriptionDetails';

const defaultHiddenColumns: Array<keyof Subscription> = [PRODUCT_NAME];
const defaultPageSize = GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES.first;

type Subscription = {
    subscriptionId: string;
    description: string;
    status: string;
    insync: boolean;
    startDate: Date | null;
    endDate: Date | null;
    productName: string;
    tag: string | null;
    note: string | null;
};

export type SubscriptionsProps = {
    pageSize: number;
    setPageSize: (updatedPageSize: number) => void;
    pageIndex: number;
    setPageIndex: (updatedPageIndex: number) => void;
    sortOrder: SubscriptionsSort;
    setSortOrder: (updatedSortOrder: SubscriptionsSort) => void;
    filterQuery: string;
    setFilterQuery: (updatedFilterQuery: string) => void;
    alwaysOnFilters?: [string, string][];
};

export const Subscriptions: FC<SubscriptionsProps> = ({
    pageSize,
    pageIndex,
    sortOrder,
    setPageSize,
    setPageIndex,
    setSortOrder,
    filterQuery,
    setFilterQuery,
    alwaysOnFilters,
}) => {
    const router = useRouter();
    const { theme } = useOrchestratorTheme();

    // Keep the state here, it should be a fully controlled component
    const [showModal, setShowModal] = useState(false);
    const [hiddenColumns, setHiddenColumns] =
        useState<Array<keyof Subscription>>(defaultHiddenColumns);

    const tableColumns: TableColumns<Subscription> = {
        subscriptionId: {
            field: SUBSCRIPTION_ID,
            name: COLUMN_LABEL_ID,
            width: '100',
            render: (value: string) => getFirstUuidPart(value),
        },
        description: {
            field: DESCRIPTION,
            name: COLUMN_LABEL_DESCRIPTION,
            width: '400',
            render: (value: string, record) => (
                <Link href={`/subscriptions/${record.subscriptionId}`}>
                    {value}
                </Link>
            ),
        },
        status: {
            field: STATUS,
            name: COLUMN_LABEL_STATUS,
            width: '110',
            render: (value: string) => (
                <SubscriptionStatusBadge subscriptionStatus={value} />
            ),
        },
        insync: {
            field: INSYNC,
            name: COLUMN_LABEL_INSYNC,
            width: '110',
            render: (value: boolean) =>
                value ? (
                    <CheckmarkCircleFill color={theme.colors.primary} />
                ) : (
                    <MinusCircleOutline color={theme.colors.mediumShade} />
                ),
        },
        productName: {
            field: PRODUCT_NAME,
            name: COLUMN_LABEL_PRODUCT,
        },
        tag: {
            field: TAG,
            name: COLUMN_LABEL_TAG,
            width: '100',
        },
        startDate: {
            field: START_DATE,
            name: COLUMN_LABEL_START_DATE,
            width: '150',
            render: parseDateToLocaleString,
        },
        endDate: {
            field: END_DATE,
            name: COLUMN_LABEL_END_DATE,
            width: '150',
            render: parseDateToLocaleString,
        },
        note: {
            field: NOTE,
            name: COLUMN_LABEL_NOTE,
        },
    };

    // Todo rename to leadingControlColumns
    const tableColumnsWithExtraNonDataFields: TableColumnsWithExtraNonDataFields<Subscription> =
        {
            inlineSubscriptionDetails: {
                field: FIELD_NAME_INLINE_SUBSCRIPTION_DETAILS,
                width: '40',
                render: () => (
                    <EuiFlexItem>
                        <PlusCircleFill color={theme.colors.mediumShade} />
                    </EuiFlexItem>
                ),
            },
            ...tableColumns,
        };

    const sortedColumnId = getTypedFieldFromObject(
        sortOrder.field,
        tableColumns,
    );

    // Convert the plain text to the accepted format for GraphQL backend
    const esQueryContainer = EuiSearchBar.Query.toESQuery(filterQuery);
    const filterQueryTupleArray =
        esQueryContainer.bool?.must?.map(mapEsQueryContainerToKeyValueTuple) ??
        [];
    const queryContainsInvalidParts =
        filterQueryTupleArray?.includes(undefined);

    const filterBy = filterQueryTupleArray
        .concat(alwaysOnFilters)
        .filter(isValidQueryPart);

    const { data, isFetching } = useStringQueryWithGraphql<
        SubscriptionsResult,
        SubscriptionsQueryVariables
    >(GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT, {
        first: pageSize,
        after: pageIndex,
        sortBy: sortedColumnId && {
            field: sortedColumnId.toString(),
            order: sortOrder.order,
        },
        filterBy,
    });
    // ... backend data is loaded and available as "data: SubscriptionsResult | undefined"

    if (!sortedColumnId) {
        router.replace('/subscriptions');
        return null;
    }

    if (!data) {
        return <Loading />;
    }

    const handleDataSort = (newSortColumnId: keyof Subscription) =>
        setSortOrder({
            field: newSortColumnId,
            order: determineNewSortOrder(
                sortedColumnId,
                sortOrder.order,
                newSortColumnId,
            ),
        });

    const handleCriteriaChange = ({ page }: Criteria<Subscription>) => {
        if (page) {
            const { index, size } = page;
            setPageSize(size);
            setPageIndex(index * size);
        }
    };

    const totalItemCount = parseInt(data.subscriptions.pageInfo.totalItems);
    const dataSorting: DataSorting<Subscription> = {
        columnId: sortedColumnId,
        sortDirection: sortOrder.order,
    };
    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: determinePageIndex(pageIndex, pageSize),
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItemCount,
    };

    return (
        <TableWithFilter
            filterQuery={filterQuery}
            setFilterQuery={setFilterQuery}
            queryContainsInvalidParts={queryContainsInvalidParts}
            setShowModal={setShowModal}
            data={mapApiResponseToSubscriptionTableData(data)}
            tableColumns={tableColumns}
            tableColumnsWithExtraNonDataFields={
                tableColumnsWithExtraNonDataFields
            }
            hiddenColumns={hiddenColumns}
            dataSorting={dataSorting}
            handleDataSort={handleDataSort}
            pagination={pagination}
            isFetching={isFetching}
            handleCriteriaChange={handleCriteriaChange}
            showModal={showModal}
            setHiddenColumns={setHiddenColumns}
            setPageSize={setPageSize}
            defaultHiddenColumns={defaultHiddenColumns}
        />
    );
};

function mapApiResponseToSubscriptionTableData(
    graphqlResponse: SubscriptionsResult,
): Subscription[] {
    return graphqlResponse.subscriptions.edges.map(
        (baseSubscription): Subscription => {
            const {
                description,
                insync,
                product,
                startDate,
                endDate,
                status,
                subscriptionId,
                note,
            } = baseSubscription.node;

            return {
                description,
                insync,
                productName: product.name,
                tag: product.tag ?? null,
                startDate: parseDate(startDate),
                endDate: parseDate(endDate),
                status,
                subscriptionId,
                note,
            };
        },
    );
}

export type TableWithFilterProps<T> = {
    filterQuery: string; // rename to initialFilterQuery
    setFilterQuery: (updatedFilterQuery: string) => void;
    queryContainsInvalidParts: boolean; // rename to isInvalidQuery
    setShowModal: (showModal: boolean) => void;
    data: T[];
    tableColumns: TableColumns<T>;
    tableColumnsWithExtraNonDataFields: TableColumnsWithExtraNonDataFields<T>;
    hiddenColumns: Array<keyof T>;
    dataSorting: DataSorting<T>;
    handleDataSort: (newSortColumnId: keyof T) => void;
    pagination: Pagination;
    isFetching: boolean;
    handleCriteriaChange: ({ page }: Criteria<T>) => void;
    showModal: boolean;
    setHiddenColumns: (updatedHiddenColumns: Array<keyof T>) => void; // rename to onUpdateHiddenColumns
    setPageSize: (updatedPageSize: number) => void;
    defaultHiddenColumns: Array<keyof T>;
};

export const TableWithFilter = <T,>({
    filterQuery,
    setFilterQuery,
    queryContainsInvalidParts,
    setShowModal,
    data,
    tableColumns,
    tableColumnsWithExtraNonDataFields,
    hiddenColumns,
    dataSorting,
    handleDataSort,
    pagination,
    isFetching,
    handleCriteriaChange,
    showModal,
    setHiddenColumns,
    setPageSize,
    defaultHiddenColumns,
}: TableWithFilterProps<T>) => {
    const tableSettingsColumns: ColumnConfig<T>[] = Object.entries<
        TableColumnConfig<T, keyof T>
    >(tableColumns).map((keyValuePair) => {
        const { field, name } = keyValuePair[1];
        return {
            field,
            name,
            isVisible: hiddenColumns.indexOf(field) === -1,
        };
    });

    return (
        <>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <SearchField
                        initialFilterQuery={filterQuery}
                        onSearch={setFilterQuery}
                        isInvalid={queryContainsInvalidParts}
                    />
                </EuiFlexItem>
                <EuiButton onClick={() => setShowModal(true)}>
                    Edit columns
                </EuiButton>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            <Table
                data={data}
                columns={tableColumnsWithExtraNonDataFields}
                hiddenColumns={hiddenColumns}
                dataSorting={dataSorting}
                onDataSort={handleDataSort}
                pagination={pagination}
                isLoading={isFetching}
                onCriteriaChange={handleCriteriaChange}
            />

            {showModal && (
                <TableSettingsModal
                    tableConfig={{
                        columns: tableSettingsColumns,
                        selectedPageSize: pagination.pageSize, // not sure if a pageSize is needed here, was "pageSize"
                    }}
                    pageSizeOptions={
                        pagination.pageSizeOptions || DEFAULT_PAGE_SIZES
                    }
                    onClose={() => setShowModal(false)}
                    onUpdateTableConfig={(updatedTableConfig) => {
                        // todo might want to just pass updatedTableConfig to the user instead of doing it here
                        const updatedHiddenColumns = updatedTableConfig.columns
                            .filter((column) => !column.isVisible)
                            .map((hiddenColumn) => hiddenColumn.field);
                        setHiddenColumns(updatedHiddenColumns);
                        setPageSize(updatedTableConfig.selectedPageSize);
                        setShowModal(false);
                    }}
                    onResetToDefaults={() => {
                        setHiddenColumns(defaultHiddenColumns);
                        setPageSize(defaultPageSize);
                        setShowModal(false);
                    }}
                />
            )}
        </>
    );
};
