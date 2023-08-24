import React from 'react';
import { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { EuiFlexItem, Pagination } from '@elastic/eui';
import { useTranslations } from 'next-intl';
import {
    DEFAULT_PAGE_SIZES,
    getDataSortHandler,
    getEsQueryStringHandler,
    getPageChangeHandler,
    SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
    TableColumnKeys,
    WFODataSorting,
    WFOTableColumns,
    WFOTableControlColumnConfig,
    WFOTableWithFilter,
} from '../WFOTable';
import { SubscriptionListItem } from './types';
import { FilterQuery } from '../WFOFilterTabs';
import { DataDisplayParams } from '../../hooks/useDataDisplayParams';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import { getFirstUuidPart } from '../../utils/uuid';
import { WFOSubscriptionStatusBadge } from '../WFOBadges/WFOSubscriptionStatusBadge';
import {
    WFOCheckmarkCircleFill,
    WFOMinusCircleOutline,
    WFOPlusCircleFill,
} from '../../icons';
import { parseDateToLocaleString } from '../../utils/date';
import { useQueryWithGraphql } from '../../hooks/useQueryWithGraphql';
import { getSubscriptionsListGraphQlQuery } from '../../graphqlQueries/subscriptionsListQuery';
import { getTypedFieldFromObject } from '../../utils/getTypedFieldFromObject';
import { WFOLoading } from '../WFOLoading';
import { SortOrder } from '../../types';
import { mapGrapghQlSubscriptionsResultToSubscriptionListItems } from './mapGrapghQlSubscriptionsResultToSubscriptionListItems';

const FIELD_NAME_INLINE_SUBSCRIPTION_DETAILS = 'inlineSubscriptionDetails';

const defaultHiddenColumns: TableColumnKeys<SubscriptionListItem> = [
    'productName',
];

export type WFOSubscriptionsListProps = {
    alwaysOnFilters?: FilterQuery<SubscriptionListItem>[];
    dataDisplayParams: DataDisplayParams<SubscriptionListItem>;
    setDataDisplayParam: <
        DisplayParamKey extends keyof DataDisplayParams<SubscriptionListItem>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<SubscriptionListItem>[DisplayParamKey],
    ) => void;
};

export const WFOSubscriptionsList: FC<WFOSubscriptionsListProps> = ({
    alwaysOnFilters,
    dataDisplayParams,
    setDataDisplayParam,
}) => {
    const router = useRouter();
    const t = useTranslations('subscriptions.index');

    const { theme } = useOrchestratorTheme();

    const tableColumns: WFOTableColumns<SubscriptionListItem> = {
        subscriptionId: {
            field: 'subscriptionId',
            name: t('id'),
            width: '100',
            render: (value) => (
                <span title={value}>{getFirstUuidPart(value)}</span>
            ),
            renderDetails: (value) => value,
        },
        description: {
            field: 'description',
            name: t('description'),
            width: '400',
            render: (value, record) => (
                <Link href={`/subscriptions/${record.subscriptionId}`}>
                    {value}
                </Link>
            ),
        },
        status: {
            field: 'status',
            name: t('status'),
            width: '110',
            render: (value) => (
                <WFOSubscriptionStatusBadge status={value.toLowerCase()} />
            ),
        },
        insync: {
            field: 'insync',
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
            field: 'productName',
            name: t('product'),
        },
        tag: {
            field: 'tag',
            name: t('tag'),
            width: '100',
        },
        startDate: {
            field: 'startDate',
            name: t('startDate'),
            width: '150',
            render: parseDateToLocaleString,
        },
        endDate: {
            field: 'endDate',
            name: t('endDate'),
            width: '150',
            render: parseDateToLocaleString,
        },
        note: {
            field: 'note',
            name: t('note'),
        },
    };

    const leadingControlColumns: WFOTableControlColumnConfig<SubscriptionListItem> =
        {
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

    const { sortBy } = dataDisplayParams;
    const { data, isFetching } = useQueryWithGraphql(
        getSubscriptionsListGraphQlQuery<SubscriptionListItem>(),
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

    const dataSorting: WFODataSorting<SubscriptionListItem> = {
        field: sortedColumnId,
        sortOrder: dataDisplayParams.sortBy?.order ?? SortOrder.ASC,
    };
    const { totalItems } = data.subscriptions.pageInfo;
    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ?? 0,
    };

    return (
        <WFOTableWithFilter<SubscriptionListItem>
            esQueryString={dataDisplayParams.esQueryString}
            onUpdateEsQueryString={getEsQueryStringHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            data={mapGrapghQlSubscriptionsResultToSubscriptionListItems(data)}
            tableColumns={tableColumns}
            leadingControlColumns={leadingControlColumns}
            defaultHiddenColumns={defaultHiddenColumns}
            dataSorting={dataSorting}
            pagination={pagination}
            isLoading={isFetching}
            localStorageKey={SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY}
            detailModalTitle={'Details - Subscription'}
            onUpdatePage={getPageChangeHandler<SubscriptionListItem>(
                setDataDisplayParam,
            )}
            onUpdateDataSort={getDataSortHandler<SubscriptionListItem>(
                dataDisplayParams,
                setDataDisplayParam,
            )}
        />
    );
};
