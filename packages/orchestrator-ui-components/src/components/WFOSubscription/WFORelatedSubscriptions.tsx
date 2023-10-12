import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EuiSpacer } from '@elastic/eui';
import { Criteria, Pagination } from '@elastic/eui';

import { WFOSearchStrikethrough } from '../../icons';
import {
    useOrchestratorTheme,
    useQueryWithGraphql,
    useDataDisplayParams,
} from '../../hooks';

import { RelatedSubscription, SortOrder } from '../../types';

import { parseDateToLocaleDateString, parseDate } from '../../utils';

import { GET_RELATED_SUBSCRIPTIONS_GRAPHQL_QUERY } from '../../graphqlQueries/relatedSubscriptionsQuery';

import { WFOLoading } from '../WFOLoading';
import { WFONoResults } from '../WFONoResults';
import { WFOSubscriptionStatusBadge } from '../WFOBadges';
import { WFOInsyncIcon } from '../WFOInsyncIcon/WFOInsyncIcon';

import { WFOFirstPartUUID } from '../WFOTable/WFOFirstPartUUID';
import {
    WFOTableColumns,
    getDataSortHandler,
    getPageChangeHandler,
} from '../WFOTable';
import { WFOBasicTable, WFODataSorting } from '../WFOTable';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZES } from '../WFOTable';

interface WFORelatedSubscriptionsProps {
    subscriptionId: string;
}

export const WFORelatedSubscriptions = ({
    subscriptionId,
}: WFORelatedSubscriptionsProps) => {
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<RelatedSubscription>({
            pageSize: DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'startDate',
                order: SortOrder.DESC,
            },
        });

    const { data, isFetching } = useQueryWithGraphql(
        GET_RELATED_SUBSCRIPTIONS_GRAPHQL_QUERY,
        {
            first: dataDisplayParams.pageSize,
            after: dataDisplayParams.pageIndex,
            subscriptionId: subscriptionId,
            sortBy: dataDisplayParams.sortBy,
        },
        'relatedSubscriptions',
    );
    const relatedSubscriptions =
        data?.subscriptions.page[0].inUseBySubscriptions.page;
    const relatedSubscriptionsPageInfo =
        data?.subscriptions.page[0].inUseBySubscriptions.pageInfo;
    const tableColumns: WFOTableColumns<RelatedSubscription> = {
        subscriptionId: {
            field: 'subscriptionId',
            name: t('id'),
            width: '100',
            render: (value) => <WFOFirstPartUUID UUID={value} />,
        },
        description: {
            field: 'description',
            name: t('description'),
            render: (value, record) => (
                <Link href={`/subscriptions/${record.subscriptionId}`}>
                    {value}
                </Link>
            ),
        },
        status: {
            field: 'status',
            name: t('status'),
            width: '100',
            render: (value) => <WFOSubscriptionStatusBadge status={value} />,
        },
        insync: {
            field: 'insync',
            name: t('insync'),
            width: '60',
            render: (value) => <WFOInsyncIcon inSync={value} />,
        },
        customer: {
            field: 'customer',
            name: t('customer'),
            render: (customer) => customer.fullname,
            sortable: false,
        },
        product: {
            field: 'product',
            name: t('tag'),
            width: '150',
            render: (product) => product.tag,
        },
        startDate: {
            field: 'startDate',
            name: t('startDate'),
            width: '100',
            render: (value) => parseDateToLocaleDateString(parseDate(value)),
        },
    };

    const sortHandler = getDataSortHandler<RelatedSubscription>(
        dataDisplayParams,
        setDataDisplayParam,
    );

    const pagination: Pagination = {
        pageSize: dataDisplayParams.pageSize,
        pageIndex: dataDisplayParams.pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: relatedSubscriptionsPageInfo?.totalItems ?? 0,
    };

    const dataSorting: WFODataSorting<RelatedSubscription> = {
        field: dataDisplayParams.sortBy?.field,
        sortOrder: dataDisplayParams.sortBy?.order,
    };

    const onUpdatePage =
        getPageChangeHandler<RelatedSubscription>(setDataDisplayParam);

    const onCriteriaChange = (criterion: Criteria<RelatedSubscription>) => {
        if (criterion.page) {
            onUpdatePage(criterion.page);
        }
    };
    return (
        (isFetching && <WFOLoading />) ||
        (relatedSubscriptions && relatedSubscriptions.length > 0 && (
            <>
                <EuiSpacer size="l" />
                <WFOBasicTable<RelatedSubscription>
                    data={relatedSubscriptions}
                    columns={tableColumns}
                    pagination={pagination}
                    isLoading={isFetching}
                    onDataSort={sortHandler}
                    dataSorting={dataSorting}
                    onCriteriaChange={onCriteriaChange}
                />
            </>
        )) || (
            <WFONoResults
                text={t('noRelatedSubscriptions')}
                icon={<WFOSearchStrikethrough color={theme.colors.link} />}
            />
        )
    );
};
