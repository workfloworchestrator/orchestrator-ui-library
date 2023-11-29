import React from 'react';

import {
    EuiFormRow,
    EuiSearchBar,
    EuiSearchBarOnChangeArgs,
} from '@elastic/eui';

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

    const onChange = ({ queryText }: EuiSearchBarOnChangeArgs) => {
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
            <EuiSearchBar
                query={queryString}
                onChange={onChange}
                box={{
                    // Todo: possible bug in EUI component EuiSearchBar
                    // https://github.com/workfloworchestrator/orchestrator-ui/issues/129
                    // setting the property 'isInvalid' to true has no effect
                    isInvalid: !queryIsValid,
                }}
            />
        </EuiFormRow>
    );
};
