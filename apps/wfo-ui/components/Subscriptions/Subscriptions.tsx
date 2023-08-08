import React from 'react';
import {
    WFOCheckmarkCircleFill,
    DataDisplayParams,
    WFODataSorting,
    DEFAULT_PAGE_SIZES,
    FilterQuery,
    getDataSortHandler,
    getEsQueryStringHandler,
    getFirstUuidPart,
    getPageChangeHandler,
    getTypedFieldFromObject,
    WFOLoading,
    WFOMinusCircleOutline,
    parseDate,
    parseDateToLocaleString,
    WFOPlusCircleFill,
    SortOrder,
    TableColumnKeys,
    WFOTableColumns,
    WFOTableControlColumnConfig,
    WFOTableWithFilter,
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
import { useTranslations } from 'next-intl';
import { SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY } from '../../constants';
import { SubscriptionsTableQuery } from '../../__generated__/graphql';
import { mapToGraphQlSortBy } from '../../utils/queryVarsMappers';

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
    const t = useTranslations('subscriptions.index');

    const { theme } = useOrchestratorTheme();

    const tableColumns: WFOTableColumns<Subscription> = {
        subscriptionId: {
            field: SUBSCRIPTION_ID,
            name: t('id'),
            width: '100',
            render: (value) => getFirstUuidPart(value),
        },
        description: {
            field: DESCRIPTION,
            name: t('description'),
            width: '400',
            render: (value, record) => (
                <Link href={`/subscriptions/${record.subscriptionId}`}>
                    {value}
                </Link>
            ),
        },
        status: {
            field: STATUS,
            name: t('status'),
            width: '110',
            render: (value) => <WFOStatusBadge status={value} />,
        },
        insync: {
            field: INSYNC,
            name: t('insync'),
            width: '110',
            render: (value) =>
                value ? (
                    <WFOCheckmarkCircleFill color={theme.colors.primary} />
                ) : (
                    <WFOMinusCircleOutline color={theme.colors.mediumShade} />
                ),
        },
        productName: {
            field: PRODUCT_NAME,
            name: t('product'),
        },
        tag: {
            field: TAG,
            name: t('tag'),
            width: '100',
        },
        startDate: {
            field: START_DATE,
            name: t('startDate'),
            width: '150',
            render: parseDateToLocaleString,
        },
        endDate: {
            field: END_DATE,
            name: t('endDate'),
            width: '150',
            render: parseDateToLocaleString,
        },
        note: {
            field: NOTE,
            name: t('note'),
        },
    };

    const leadingControlColumns: WFOTableControlColumnConfig<Subscription> = {
        inlineSubscriptionDetails: {
            field: FIELD_NAME_INLINE_SUBSCRIPTION_DETAILS,
            width: '40',
            render: () => (
                <EuiFlexItem>
                    <WFOPlusCircleFill color={theme.colors.mediumShade} />
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
        return <WFOLoading />;
    }

    const dataSorting: WFODataSorting<Subscription> = {
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
        <WFOTableWithFilter<Subscription>
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
