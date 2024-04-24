import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiFieldSearch, EuiFormRow } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getWfoSearchBarStyles } from './styles';

export type WfoSearchFieldProps = {
    queryString?: string;
    onUpdateQueryString?: (queryString: string) => void;
};

export const WfoSearchField = ({
    queryString,
    onUpdateQueryString,
}: WfoSearchFieldProps) => {
    const t = useTranslations('common');
    const tError = useTranslations('errors');
    const { searchBarStyle } = useWithOrchestratorTheme(getWfoSearchBarStyles);

    const queryIsValid = true; // Query validation turned of for now until ESQueries can be sent to the backend

    const [currentQuery, setCurrentQuery] = useState(queryString ?? '');
    useEffect(() => {
        setCurrentQuery(queryString ?? '');
    }, [queryString]);

    const handleSearch = (queryText: string) =>
        onUpdateQueryString?.(queryText);

    return (
        <EuiFormRow
            fullWidth
            isInvalid={!queryIsValid}
            error={[tError('invalidQueryParts')]}
        >
            <EuiFieldSearch
                css={searchBarStyle}
                value={currentQuery}
                placeholder={`${t('search')}...`}
                onChange={(event) => setCurrentQuery(event.target.value)}
                onSearch={handleSearch}
                onBlur={(event) => handleSearch(event.target.value)}
                isInvalid={!queryIsValid}
                fullWidth
            />
        </EuiFormRow>
    );
};
