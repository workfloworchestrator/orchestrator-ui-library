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
    TableColumns,
    useOrchestratorTheme,
    useStringQueryWithGraphql,
    parseDateToLocaleString,
    Loading,
    mapEsQueryContainerToKeyValueTuple,
    isValidQueryPart,
    TableControlColumnConfig,
    TableWithFilter,
    TableColumnKeys,
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { EuiFlexItem, EuiSearchBar } from '@elastic/eui';
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
} from './subscriptionsQuery';
import { Criteria, Pagination } from '@elastic/eui';
import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '../../constants';

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

const defaultHiddenColumns: TableColumnKeys<Subscription> = [PRODUCT_NAME];
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

    const tableColumns: TableColumns<Subscription> = {
        subscriptionId: {
            field: SUBSCRIPTION_ID,
            name: COLUMN_LABEL_ID,
            width: '100',
            render: (value) => getFirstUuidPart(value),
        },
        description: {
            field: DESCRIPTION,
            name: COLUMN_LABEL_DESCRIPTION,
            width: '400',
            render: (value, record) => (
                <Link href={`/subscriptions/${record.subscriptionId}`}>
                    {value}
                </Link>
            ),
        },
        status: {
            field: STATUS,
            name: COLUMN_LABEL_STATUS,
            width: '110',
            render: (value) => (
                <SubscriptionStatusBadge subscriptionStatus={value} />
            ),
        },
        insync: {
            field: INSYNC,
            name: COLUMN_LABEL_INSYNC,
            width: '110',
            render: (value) =>
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

    const leadingControlColumns: TableControlColumnConfig<Subscription> = {
        inlineSubscriptionDetails: {
            field: FIELD_NAME_INLINE_SUBSCRIPTION_DETAILS,
            width: '40',
            render: () => (
                <EuiFlexItem>
                    <PlusCircleFill color={theme.colors.mediumShade} />
                </EuiFlexItem>
            ),
        },
    };

    const sortedColumnId = getTypedFieldFromObject(
        sortOrder.field,
        tableColumns,
    );

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
    >(
        GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT,
        {
            first: pageSize,
            after: pageIndex,
            sortBy: sortedColumnId && {
                field: sortedColumnId.toString(),
                order: sortOrder.order,
            },
            filterBy,
        },
        'subscriptions',
    );

    if (!sortedColumnId) {
        router.replace('/subscriptions');
        return null;
    }

    if (!data) {
        return <Loading />;
    }

    const dataSorting: DataSorting<Subscription> = {
        columnId: sortedColumnId,
        sortDirection: sortOrder.order,
    };
    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: determinePageIndex(pageIndex, pageSize),
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: parseInt(data.subscriptions.pageInfo.totalItems),
    };

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

    return (
        <TableWithFilter
            data={mapApiResponseToSubscriptionTableData(data)}
            tableColumns={tableColumns}
            leadingControlColumns={leadingControlColumns}
            defaultHiddenColumns={defaultHiddenColumns}
            dataSorting={dataSorting}
            pagination={pagination}
            filterQuery={filterQuery}
            isInvalidFilterQuery={queryContainsInvalidParts}
            isLoading={isFetching}
            localStorageKey={SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY}
            onUpdateFilterQuery={setFilterQuery}
            onCriteriaChange={handleCriteriaChange}
            onUpdatePageSize={setPageSize}
            onResetPageSize={() => setPageSize(defaultPageSize)}
            onUpdateDataSort={handleDataSort}
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
