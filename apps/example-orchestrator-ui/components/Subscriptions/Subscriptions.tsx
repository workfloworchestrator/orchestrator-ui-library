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
} from '@orchestrator-ui/orchestrator-ui-components';
import React, { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { EuiFlexItem, EuiFormRow, EuiSearchBar } from '@elastic/eui';
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
import { QueryContainer } from '@elastic/eui/src/components/search_bar/query/ast_to_es_query_dsl';

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
}) => {
    const router = useRouter();
    const { theme } = useOrchestratorTheme();
    const hiddenColumns: Array<keyof Subscription> = [PRODUCT_NAME];

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

    const esQueryContainer = EuiSearchBar.Query.toESQuery(filterQuery);
    const filterQueryTupleArray = esQueryContainer.bool?.must?.map(
        mapEsQueryContainerToKeyValueTuple,
    );
    const queryContainsInvalidParts =
        filterQueryTupleArray?.includes(undefined);
    const filterBy = filterQueryTupleArray?.filter(isValidQueryPart);

    const { data, isFetching } = useStringQueryWithGraphql<
        SubscriptionsResult,
        SubscriptionsQueryVariables
    >(GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT, {
        ...GET_SUBSCRIPTIONS_PAGINATED_DEFAULT_VARIABLES,
        first: pageSize,
        after: pageIndex,
        sortBy: sortedColumnId && {
            field: sortedColumnId.toString(),
            order: sortOrder.order,
        },
        filterBy,
    });

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

    const handleCriteriaChange = (criteria: Criteria<Subscription>) => {
        const { page } = criteria;
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
        <>
            <EuiFormRow
                fullWidth
                isInvalid={queryContainsInvalidParts}
                error={[
                    'Incorrect query',
                ]} /* Todo more descriptive error message*/
            >
                <EuiSearchBar
                    query={filterQuery}
                    onChange={({ queryText }) => {
                        setFilterQuery(queryText);
                    }}
                    box={{
                        isInvalid: queryContainsInvalidParts, // Todo possible bug in EUI component
                    }}
                />
            </EuiFormRow>

            <Table
                data={mapApiResponseToSubscriptionTableData(data)}
                columns={tableColumnsWithExtraNonDataFields}
                hiddenColumns={hiddenColumns}
                dataSorting={dataSorting}
                onDataSort={handleDataSort}
                pagination={pagination}
                isLoading={isFetching}
                onCriteriaChange={handleCriteriaChange}
            />
        </>
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

// Todo: fix ts-ignores
function mapEsQueryContainerToKeyValueTuple(queryContainer: QueryContainer) {
    if (queryContainer.match !== undefined) {
        const firstKey: string = Object.keys(queryContainer.match)[0];

        // @ts-ignore
        const firstValue: string = queryContainer.match[firstKey].query;
        console.log({ firstKey, firstValue });
        return [firstKey, firstValue];
    }

    if (queryContainer.match_phrase !== undefined) {
        const firstKey: string = Object.keys(queryContainer.match_phrase)[0];

        // @ts-ignore
        const firstValue: string = queryContainer.match_phrase[firstKey];
        console.log({ firstKey, firstValue });
        return [firstKey, firstValue];
    }

    if (queryContainer.simple_query_string !== undefined) {
        // @ts-ignore
        return ['tsv', queryContainer.simple_query_string.query];
    }

    // returning undefined for unsupported query-matchers
    return undefined;
}

function isValidQueryPart(
    filter: string[] | undefined,
): filter is [string, string] {
    return filter !== undefined && filter?.length === 2;
}
