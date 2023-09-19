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
import { WFOSubscriptionStatusBadge } from '../WFOBadges/WFOSubscriptionStatusBadge';
import {
    WFOCheckmarkCircleFill,
    WFOMinusCircleOutline,
    WFOPlusCircleFill,
} from '../../icons';
import { useQueryWithGraphql } from '../../hooks/useQueryWithGraphql';
import { getSubscriptionsListGraphQlQuery } from '../../graphqlQueries/subscriptionsListQuery';
import { getTypedFieldFromObject } from '../../utils/getTypedFieldFromObject';
import { WFOLoading } from '../WFOLoading';
import { SortOrder } from '../../types';
import { mapGrapghQlSubscriptionsResultToSubscriptionListItems } from './mapGrapghQlSubscriptionsResultToSubscriptionListItems';
import { WFOFirstPartUUID } from '../WFOTable/WFOFirstPartUUID';
import { WFODateTime } from '../WFODateTime/WFODateTime';
import { parseDateToLocaleDateTimeString } from '../../utils';

const FIELD_NAME_INLINE_SUBSCRIPTION_DETAILS = 'inlineSubscriptionDetails';

export type WFOSubscriptionsListProps = {
    alwaysOnFilters?: FilterQuery<SubscriptionListItem>[];
    dataDisplayParams: DataDisplayParams<SubscriptionListItem>;
    setDataDisplayParam: <
        DisplayParamKey extends keyof DataDisplayParams<SubscriptionListItem>,
    >(
        prop: DisplayParamKey,
        value: DataDisplayParams<SubscriptionListItem>[DisplayParamKey],
    ) => void;
    hiddenColumns: TableColumnKeys<SubscriptionListItem> | undefined;
};

export const WFOSubscriptionsList: FC<WFOSubscriptionsListProps> = ({
    alwaysOnFilters,
    dataDisplayParams,
    setDataDisplayParam,
    hiddenColumns,
}) => {
    // TODO: There seems to be a problem showing the product/productName in this list
    // https://github.com/workfloworchestrator/orchestrator-ui/issues/262

    const router = useRouter();
    const t = useTranslations('subscriptions.index');

    const { theme } = useOrchestratorTheme();

    const tableColumns: WFOTableColumns<SubscriptionListItem> = {
        subscriptionId: {
            field: 'subscriptionId',
            name: t('id'),
            width: '100',
            render: (value) => <WFOFirstPartUUID UUID={value} />,
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
            render: (value) => <WFODateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
        },
        endDate: {
            field: 'endDate',
            name: t('endDate'),
            width: '150',
            render: (value) => <WFODateTime dateOrIsoString={value} />,
            renderDetails: parseDateToLocaleDateTimeString,
            clipboardText: parseDateToLocaleDateTimeString,
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
            defaultHiddenColumns={hiddenColumns}
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
