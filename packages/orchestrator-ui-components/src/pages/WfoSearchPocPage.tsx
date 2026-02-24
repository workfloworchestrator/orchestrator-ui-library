import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import {
    EuiFlexItem,
    EuiSearchBar,
    EuiSpacer,
    Query,
    SearchFilterConfig,
} from '@elastic/eui';
import { EuiSearchBarOnChangeArgs } from '@elastic/eui/src/components/search_bar/search_bar';

import {
    WfoContentHeader,
    WfoError,
    WfoFirstPartUUID,
    WfoTable,
} from '@/components';
import type { WfoTableColumnConfig } from '@/components';
import { parseElasticQueryString } from '@/components';
import { ColumnType } from '@/components/WfoTable/WfoTable';
import { SearchPayload } from '@/rtk';
import { useSearchMutation } from '@/rtk';
import { SearchResult } from '@/types';

export const WfoSearchPocPage = () => {
    const t = useTranslations('search.page');
    const [searchBarError, setSearchBarError] =
        useState<EuiSearchBarOnChangeArgs['error']>();
    const [triggerSearch, { isLoading, isError, data, error }] =
        useSearchMutation();

    if (error) {
        console.error('searchError', error);
    }

    const onSearch = (onChangeArgs: EuiSearchBarOnChangeArgs) => {
        const { query, queryText, error } = onChangeArgs;

        if (error) {
            setSearchBarError(error);
            console.error('searchBarError', error);
        } else {
            setSearchBarError(undefined);
        }

        const searchPayload: SearchPayload = {
            query: queryText,
            entity_type: 'SUBSCRIPTION',
        };

        if (query) {
            const esQueryString = Query.toESQueryString(query);
            const filters = parseElasticQueryString(esQueryString);
            if (filters) {
                searchPayload.filters = filters;
            }
        }

        triggerSearch(searchPayload);
    };

    const tableColumns: WfoTableColumnConfig<SearchResult> = {
        entity_id: {
            columnType: ColumnType.DATA,
            label: t('id'),
            width: '90px',
            renderData: (value) => <WfoFirstPartUUID UUID={value} />,
        },
        entity_type: {
            columnType: ColumnType.DATA,
            label: t('type'),
            width: '120px',
            renderData: (value) => <div>{value}</div>,
        },
        entity_title: {
            columnType: ColumnType.DATA,
            label: t('title'),
            width: '500px',
            renderData: (value, record) => (
                <Link href={`/subscriptions/${record.entity_id}`}>{value}</Link>
            ),
            renderTooltip: (value) => value,
        },

        score: {
            columnType: ColumnType.DATA,
            label: t('score'),
            width: '150px',
            renderData: (value) => <div>{value}</div>,
        },
        matching_field: {
            columnType: ColumnType.DATA,
            label: t('matchingField'),
            width: '500px',
            renderData: (matchingField) => (
                <div>
                    <strong>path</strong>: {matchingField?.path},{' '}
                    <strong>value</strong>: {matchingField?.text}
                </div>
            ),
        },
    };

    const filters: SearchFilterConfig[] = [
        {
            type: 'field_value_toggle_group',
            field: 'subscription.product.status',
            items: [
                {
                    value: 'open',
                    name: 'Open',
                },
                {
                    value: 'closed',
                    name: 'Closed',
                },
            ],
        },
        {
            type: 'is',
            field: 'active',
            name: 'Active',
            negatedName: 'Inactive',
        },
        {
            type: 'field_value_toggle',
            name: 'Owned by me',
            field: 'subscription.customer',
            value: 'surf',
        },
        {
            type: 'field_value_toggle',
            name: 'Newest',
            field: 'subscription.fromData',
            value: new Date().toISOString(),
            operator: 'gt',
        },
        {
            type: 'field_value_selection',
            field: 'title',
            name: 'Product',
            multiSelect: 'or',
            operator: 'exact',
            cache: 10000, // will cache the loaded tags for 10 sec
            options: [
                {
                    field: 'subscription.product',
                    value: 'L2VPN',
                },
                {
                    field: 'subscription.product',
                    value: 'L3VPN',
                },
                {
                    field: 'subscription.product',
                    value: 'Lightpath',
                },
            ],
        },
    ];

    return (
        <>
            <WfoContentHeader title="Search page POC" />
            <>
                <EuiSearchBar
                    onChange={(onChangeArgs) => {
                        onSearch(onChangeArgs);
                    }}
                    filters={filters}
                />

                {searchBarError && (
                    <EuiFlexItem style={{ margin: '10px 0', color: 'red' }}>
                        {searchBarError?.message}
                    </EuiFlexItem>
                )}
            </>

            <EuiSpacer size="xxl" />
            {isError && <WfoError />}
            <WfoTable<SearchResult>
                data={data?.data ?? []}
                columnConfig={tableColumns}
                isLoading={isLoading}
            />
        </>
    );
};
