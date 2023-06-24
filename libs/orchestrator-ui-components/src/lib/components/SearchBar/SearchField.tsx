import React, { FC } from 'react';
import { EuiFormRow, EuiSearchBar } from '@elastic/eui';

export type SearchFieldProps = {
    initialFilterQuery: string;
    isInvalid?: boolean;
    onSearch: (query: string) => void;
};

export const SearchField: FC<SearchFieldProps> = ({
    initialFilterQuery,
    onSearch,
    isInvalid,
}) => {
    return (
        <EuiFormRow
            fullWidth
            isInvalid={isInvalid}
            error={['The query contains invalid parts']}
        >
            <EuiSearchBar
                query={initialFilterQuery}
                onChange={({ queryText }) => {
                    onSearch(queryText);
                }}
                box={{
                    // Todo: possible bug in EUI component EuiSearchBar
                    // setting the property 'isInvalid' to true has no effect
                    isInvalid: isInvalid,
                }}
            />
        </EuiFormRow>
    );
};
