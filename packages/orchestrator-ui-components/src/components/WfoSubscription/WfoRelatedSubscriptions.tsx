import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiSwitch } from '@elastic/eui';

import {
    DEFAULT_PAGE_SIZES,
    WfoDataSorting,
    WfoFirstPartUUID,
    WfoInsyncIcon,
    WfoNoResults,
    WfoSubscriptionStatusBadge,
    getDataSortHandler,
    getPageIndexChangeHandler,
    getPageSizeChangeHandler,
} from '@/components';
import { PATH_SUBSCRIPTIONS } from '@/components';
import {
    ColumnType,
    Pagination,
    WfoTable,
    WfoTableColumnConfig,
} from '@/components/WfoTable/WfoTable';
import { useDataDisplayParams, useOrchestratorTheme } from '@/hooks';
import { WfoSearchStrikethrough } from '@/icons';
import { useGetRelatedSubscriptionsQuery } from '@/rtk';
import {
    GraphqlFilter,
    RelatedSubscription,
    SortOrder,
    SubscriptionStatus,
} from '@/types';
import { parseDate, parseDateToLocaleDateString } from '@/utils';

interface WfoRelatedSubscriptionsProps {
    subscriptionId: string;
}

export const WfoRelatedSubscriptions = ({
    subscriptionId,
}: WfoRelatedSubscriptionsProps) => {
    const [hideTerminatedSubscriptions, setHideTerminatedSubscriptions] =
        useState<boolean>(true);
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();

    const terminatedSubscriptionsFilter: GraphqlFilter<RelatedSubscription> = {
        field: 'status',
        value: `${SubscriptionStatus.ACTIVE}-${SubscriptionStatus.DISABLED}-${SubscriptionStatus.INITIAL}-${SubscriptionStatus.MIGRATING}-${SubscriptionStatus.PROVISIONING}`,
    };

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<RelatedSubscription>({
            sortBy: {
                field: 'startDate',
                order: SortOrder.DESC,
            },
        });

    const { data, isFetching, isLoading } = useGetRelatedSubscriptionsQuery({
        first: dataDisplayParams.pageSize,
        after: dataDisplayParams.pageIndex * dataDisplayParams.pageSize,
        subscriptionId: subscriptionId,
        sortBy: dataDisplayParams.sortBy,
        terminatedSubscriptionFilter: hideTerminatedSubscriptions
            ? terminatedSubscriptionsFilter
            : undefined,
    });

    const relatedSubscriptions = data?.relatedSubscriptions;
    const relatedSubscriptionsPageInfo = data?.pageInfo;

    // Todo: use the data from GQL to determine isSortable
    const tableColumns: WfoTableColumnConfig<RelatedSubscription> = {
        subscriptionId: {
            columnType: ColumnType.DATA,
            label: t('id'),
            width: '100',
            renderData: (value) => <WfoFirstPartUUID UUID={value} />,
            isSortable: true,
        },
        description: {
            columnType: ColumnType.DATA,
            label: t('description'),
            renderData: (value, record) => (
                <Link
                    target="_blank"
                    href={`${PATH_SUBSCRIPTIONS}/${record.subscriptionId}`}
                >
                    {value}
                </Link>
            ),
            isSortable: true,
        },
        status: {
            columnType: ColumnType.DATA,
            label: t('status'),
            width: '130',
            renderData: (value) => (
                <WfoSubscriptionStatusBadge status={value} />
            ),
            isSortable: true,
        },
        insync: {
            columnType: ColumnType.DATA,
            label: t('insync'),
            width: '60',
            renderData: (value) => <WfoInsyncIcon inSync={value} />,
            isSortable: true,
        },
        customer: {
            columnType: ColumnType.DATA,
            label: t('customer'),
            renderData: (customer) => customer.fullname,
            isSortable: false,
        },
        product: {
            columnType: ColumnType.DATA,
            label: t('tag'),
            width: '150',
            renderData: (product) => product.tag,
            isSortable: true,
        },
        startDate: {
            columnType: ColumnType.DATA,
            label: t('startDate'),
            width: '100',
            renderData: (value) =>
                parseDateToLocaleDateString(parseDate(value)),
            isSortable: true,
        },
    };

    // WfoTable
    const onUpdatePageIndex =
        getPageIndexChangeHandler<RelatedSubscription>(setDataDisplayParam);
    const onUpdatePageSize =
        getPageSizeChangeHandler<RelatedSubscription>(setDataDisplayParam);

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        totalItemCount: relatedSubscriptionsPageInfo?.totalItems ?? 0,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        onChangeItemsPerPage: onUpdatePageSize,
        onChangePage: onUpdatePageIndex,
    };

    const dataSorting: WfoDataSorting<RelatedSubscription> = {
        field: dataDisplayParams.sortBy?.field,
        sortOrder: dataDisplayParams.sortBy?.order,
    };

    const toggleTerminatedSubscriptions = () => {
        setHideTerminatedSubscriptions((currentValue) => !currentValue);
    };

    return (
        <>
            <EuiSpacer size="xl" />
            <EuiFlexGroup justifyContent="flexEnd">
                <EuiFlexItem grow={0}>
                    <EuiSwitch
                        showLabel={true}
                        label={t('hideTerminatedRelatedSubscriptions')}
                        type="button"
                        checked={hideTerminatedSubscriptions}
                        onChange={toggleTerminatedSubscriptions}
                    />
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
            {(relatedSubscriptions &&
                relatedSubscriptions.length > 0 &&
                (!isLoading ||
                    // This situation represents the situation where the hideRelatedsubscriptions is being toggled
                    // in which case we don't want to show the loadingState because it makes the page flicker
                    (!hideTerminatedSubscriptions &&
                        relatedSubscriptions.length > 0)) && (
                    <WfoTable
                        data={relatedSubscriptions}
                        columnConfig={tableColumns}
                        pagination={pagination}
                        isLoading={isFetching}
                        onUpdateDataSorting={getDataSortHandler(
                            setDataDisplayParam,
                        )}
                        dataSorting={[dataSorting]}
                    />
                )) || (
                <WfoNoResults
                    text={t('noRelatedSubscriptions')}
                    icon={<WfoSearchStrikethrough color={theme.colors.link} />}
                />
            )}
        </>
    );
};
