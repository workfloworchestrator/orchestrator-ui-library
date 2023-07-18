import {
    CheckmarkCircleFill,
    DataSorting,
    DEFAULT_PAGE_SIZES,
    determineNewSortOrder,
    determinePageIndex,
    FilterQuery,
    getFirstUuidPart,
    getTypedFieldFromObject,
    isValidQueryPart,
    Loading,
    mapEsQueryContainerToGraphqlFilter,
    MinusCircleOutline,
    parseDateToLocaleString,
    PlusCircleFill,
    TableColumnKeys,
    TableColumns,
    TableControlColumnConfig,
    TableWithFilter,
    useOrchestratorTheme,
    useQueryWithGraphql,
    WFOStatusBadge,
} from '@orchestrator-ui/orchestrator-ui-components';
import { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Criteria, EuiFlexItem, EuiSearchBar, Pagination } from '@elastic/eui';
import {
    DESCRIPTION,
    END_DATE,
    GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT,
    INSYNC,
    NOTE,
    PRODUCT_NAME,
    START_DATE,
    STATUS,
    SUBSCRIPTION_ID,
    SubscriptionsSort,
    TAG,
} from './subscriptionsQuery';
import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '../../constants';
import {
    SortOrder,
    SubscriptionsTableQuery,
} from '../../__generated__/graphql';

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

export type Subscription = {
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
    alwaysOnFilters?: FilterQuery[];
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
            render: (value) => <WFOStatusBadge status={value} />,
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
    const filterQueryGraphqlFilter =
        esQueryContainer.bool?.must?.map(mapEsQueryContainerToGraphqlFilter) ??
        [];

    const filterBy = filterQueryGraphqlFilter
        .concat(alwaysOnFilters)
        .filter(isValidQueryPart);

    const { data, isFetching } = useQueryWithGraphql(
        GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT,
        {
            first: pageSize,
            after: pageIndex,
            // Todo introduce a mapper utility function
            sortBy: sortedColumnId && {
                field: sortedColumnId.toString(),
                order:
                    sortOrder.order === 'ASC' ? SortOrder.Asc : SortOrder.Desc,
            },
            filterBy,
        },
        'subscriptions',
        true,
    );

    if (!sortedColumnId) {
        router.replace('/subscriptions');
        return null;
    }

    if (!data) {
        return <Loading />;
    }

    const dataSorting: DataSorting<Subscription> = {
        field: sortedColumnId,
        sortOrder: sortOrder.order,
    };
    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: determinePageIndex(pageIndex, pageSize),
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        // todo: totalItems is, according to type, not always present
        totalItemCount: data.subscriptions.pageInfo.totalItems
            ? parseInt(data.subscriptions.pageInfo.totalItems)
            : 0,
        // totalItemCount: parseInt(data.subscriptions.pageInfo.totalItems),
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

    const onUpdatePage = (page: Criteria<Subscription>['page']) => {
        if (page) {
            setPageSize(page.size);
        }
    };

    return (
        <TableWithFilter<Subscription>
            __filterQuery={filterQuery}
            __setFilterQuery={setFilterQuery}
            onUpdateEsQueryString={(esQueryString) => console.log('FILLER', esQueryString)}
            data={mapApiResponseToSubscriptionTableData(data)}
            tableColumns={tableColumns}
            leadingControlColumns={leadingControlColumns}
            defaultHiddenColumns={defaultHiddenColumns}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isFetching}
            localStorageKey={SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY}
            onUpdatePage={onUpdatePage}
            onUpdateDataSort={handleDataSort}
        />
    );
};

function mapApiResponseToSubscriptionTableData(
    graphqlResponse: SubscriptionsTableQuery,
): Subscription[] {
    return graphqlResponse.subscriptions.page.map((subscription) => {
        const {
            description,
            insync,
            product,
            startDate, // todo handle any
            endDate, // todo handle any
            status,
            subscriptionId, // todo handle any
            note,
        } = subscription;

        const { name: productName, tag } = product;

        return {
            description,
            insync,
            productName,
            tag,
            startDate,
            endDate,
            status,
            subscriptionId,
            note: note ?? null,
        };
    });
}
