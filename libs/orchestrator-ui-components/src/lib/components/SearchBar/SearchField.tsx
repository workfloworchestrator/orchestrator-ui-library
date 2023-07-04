import React, { FC } from 'react';
import { EuiFormRow, EuiSearchBar } from '@elastic/eui';

export type SearchFieldProps = {
    filterQuery: string;
    isInvalid?: boolean;
    onUpdateFilterQuery: (query: string) => void;
};

export const SearchField: FC<SearchFieldProps> = ({
    filterQuery,
    onUpdateFilterQuery,
    isInvalid,
}) => (
    <EuiFormRow
        fullWidth
        isInvalid={isInvalid}
        error={['The query contains invalid parts']}
    >
        <EuiSearchBar
            query={filterQuery}
            onChange={({ queryText }) => onUpdateFilterQuery(queryText)}
            box={{
                // Todo: possible bug in EUI component EuiSearchBar
                // https://github.com/workfloworchestrator/orchestrator-ui/issues/129
                // setting the property 'isInvalid' to true has no effect
                isInvalid: isInvalid,
            }}
        />
    </EuiFormRow>
);
