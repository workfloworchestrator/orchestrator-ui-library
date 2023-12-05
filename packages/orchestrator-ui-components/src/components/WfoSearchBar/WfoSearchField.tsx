import React, { useEffect, useState } from 'react';

import { EuiFieldSearch, EuiFormRow } from '@elastic/eui';

export type WfoSearchFieldProps = {
    __filterQuery?: string; // Deprecated Pythia related way of passing querystring
    __setFilterQuery?: (updatedFilterQuery: string) => void; // Deprecated Pythia related way of setting querystring
    esQueryString?: string;
    onUpdateEsQueryString?: (esQueryString: string) => void;
};

export const WfoSearchField = ({
    __filterQuery,
    __setFilterQuery,
    esQueryString,
    onUpdateEsQueryString,
}: WfoSearchFieldProps) => {
    const queryString = __filterQuery || esQueryString;
    const queryIsValid = true; // Query validation turned of for now until ESQueries can be sent to the backend

    const [currentQuery, setCurrentQuery] = useState(queryString ?? '');
    useEffect(() => {
        setCurrentQuery(queryString ?? '');
    }, [queryString]);

    // Todo: clean this up - remove deprecated props
    const onChange = (queryText: string) => {
        if (__setFilterQuery) {
            __setFilterQuery(queryText);
        } else {
            if (onUpdateEsQueryString) {
                onUpdateEsQueryString(queryText);
            }
        }
    };

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
                onSearch={(value) => onChange(value)}
                onBlur={(event) => {
                    onChange(event.target.value);
                }}
                isInvalid={!queryIsValid}
                fullWidth
            />
        </EuiFormRow>
    );
};
