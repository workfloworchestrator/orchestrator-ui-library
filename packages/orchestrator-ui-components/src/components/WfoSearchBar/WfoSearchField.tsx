import React, { useEffect, useState } from 'react';

import { EuiFieldSearch, EuiFormRow } from '@elastic/eui';

export type WfoSearchFieldProps = {
    queryString?: string;
    onUpdateQueryString?: (esQueryString: string) => void;
};

export const WfoSearchField = ({
    queryString,
    onUpdateQueryString,
}: WfoSearchFieldProps) => {
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
            error={['The query contains invalid parts']}
        >
            <EuiFieldSearch
                value={currentQuery}
                placeholder="Search..."
                onChange={(event) => setCurrentQuery(event.target.value)}
                onSearch={handleSearch}
                onBlur={(event) => handleSearch(event.target.value)}
                isInvalid={!queryIsValid}
                fullWidth
            />
        </EuiFormRow>
    );
};
