import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiFlexItem, EuiSearchBar, EuiSpacer, Query } from '@elastic/eui';
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

/*
entity_id: string;
entity_type: EntityKind;
entity_title: string;
score: number;
perfect_match: number;
matching_field?: MatchingField | null;
*/

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

    return (
        <>
            <WfoContentHeader title="Search page POC" />
            <>
                <EuiSearchBar
                    onChange={(onChangeArgs) => {
                        onSearch(onChangeArgs);
                    }}
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
