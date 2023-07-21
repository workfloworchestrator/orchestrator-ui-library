import {
    CheckmarkCircleFill,
    DataDisplayParams,
    DataSorting,
    DEFAULT_PAGE_SIZES,
    FilterQuery,
    getDataSortHandler,
    getEsQueryStringHandler,
    getFirstUuidPart,
    getPageChangeHandler,
    getTypedFieldFromObject,
    Loading,
    MinusCircleOutline,
    parseDate,
    parseDateToLocaleString,
    PlusCircleFill,
    SortOrder,
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
import { EuiFlexItem, Pagination } from '@elastic/eui';
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
    TAG,
} from './subscriptionsQuery';
import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '../../constants';
import { SubscriptionsTableQuery } from '../../__generated__/graphql';
import { mapToGraphQlSortBy } from '../../utils/queryVarsMappers';

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
    alwaysOnFilters?: FilterQuery[];
    dataDisplayParams: DataDisplayParams<Subscription>;
    setDataDisplayParam: <
        DisplayParamKey extends keyof DataDisplayParams<Subscription>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<Subscription>[DisplayParamKey],
    ) => void;
};

export const Subscriptions: FC<SubscriptionsProps> = ({
    alwaysOnFilters,
    dataDisplayParams,
    setDataDisplayParam,
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

    const sortBy = mapToGraphQlSortBy(dataDisplayParams.sortBy);
    const { data, isFetching } = useQueryWithGraphql(
        GET_SUBSCRIPTIONS_PAGINATED_REQUEST_DOCUMENT,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
            sortBy,
            filterBy: alwaysOnFilters,
        },
        'subscriptions',
        true,
    );

    const sortedColumnId = getTypedFieldFromObject(sortBy?.field, tableColumns);
    if (!sortedColumnId) {
        router.replace('/subscriptions');
        return null;
    }

    if (!data) {
        return <Loading />;
    }

    const dataSorting: DataSorting<Subscription> = {
        field: sortedColumnId,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };
    const { totalItems } = data.subscriptions.pageInfo;
    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? parseInt(totalItems) : 0,
    };

    return (
        <TableWithFilter<Subscription>
            esQueryString={dataDisplayParams.esQueryString}
            onUpdateEsQueryString={getEsQueryStringHandler<Subscription>(
                setDataDisplayParam,
            )}
            data={mapApiResponseToSubscriptionTableData(data)}
            tableColumns={tableColumns}
            leadingControlColumns={leadingControlColumns}
            defaultHiddenColumns={defaultHiddenColumns}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isFetching}
            localStorageKey={SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY}
            onUpdatePage={getPageChangeHandler<Subscription>(
                setDataDisplayParam,
            )}
            onUpdateDataSort={getDataSortHandler<Subscription>(
                dataDisplayParams,
                setDataDisplayParam,
            )}
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
            startDate,
            endDate,
            status,
            subscriptionId,
            note,
        } = subscription;

        const { name: productName, tag } = product;

        return {
            description,
            insync,
            productName,
            tag,
            startDate: parseDate(startDate),
            endDate: parseDate(endDate),
            status,
            subscriptionId,
            note: note ?? null,
        };
    });
}
