import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiSearchBar, EuiSpacer } from '@elastic/eui';

import { WfoContentHeader, WfoTable } from '@/components';
import type { WfoTableColumnConfig } from '@/components';
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
    const [triggerSearch, { isLoading, isError, data, error }] =
        useSearchMutation();

    const onSearch = (query: unknown, queryText: string) => {
        const searchPayload: SearchPayload = {
            query: queryText,
            entity_type: 'SUBSCRIPTION',
        };
        console.log('query', query, queryText);
        triggerSearch(searchPayload);
    };
    console.log('data', data, isLoading, isError, error);

    const tableColumns: WfoTableColumnConfig<SearchResult> = {
        entity_id: {
            columnType: ColumnType.DATA,
            label: t('id'),
            width: '90px',
            renderData: (value) => <div>{value}</div>,
        },
        entity_type: {
            columnType: ColumnType.DATA,
            label: t('type'),
            width: '90px',
            renderData: (value) => <div>{value}</div>,
        },
        entity_title: {
            columnType: ColumnType.DATA,
            label: t('title'),
            width: '450px',
            renderData: (value) => <div>{value}</div>,
        },
        score: {
            columnType: ColumnType.DATA,
            label: t('score'),
            width: '90px',
            renderData: (value) => <div>{value}</div>,
        },
        matching_field: {
            columnType: ColumnType.DATA,
            label: t('matchingField'),
            width: '120px',
            renderData: (matchingField) => <div>{matchingField?.text}</div>,
        },
    };

    return (
        <>
            <WfoContentHeader title="Search page POC" />
            <EuiSearchBar
                onChange={(onChangeArgs) => {
                    const { query, queryText } = onChangeArgs;
                    onSearch(query, queryText);
                }}
            />
            <EuiSpacer size="xxl" />
            <WfoTable<SearchResult>
                data={data?.data ?? []}
                columnConfig={tableColumns}
                isLoading={isLoading}
            />
        </>
    );
};
