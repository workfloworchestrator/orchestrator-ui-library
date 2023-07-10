// The final implementation of this component happens in a different story
// @ts-nocheck
import React, { useState } from 'react';
import { EuiHealth, EuiSearchBar } from '@elastic/eui';

const tags = [
    { name: 'L3VPN', color: 'succes' },
    { name: 'L2VPN', color: 'success' },
    { name: 'SP', color: 'primary' },
    { name: 'Node', color: 'secondary' },
    { name: 'Firewall', color: 'success' },
];

const loadTags = () => {
    return new Promise((resolve) => {
        resolve(
            tags.map((tag) => ({
                value: tag.name,
                view: <EuiHealth color={tag.color}>{tag.name}</EuiHealth>,
            })),
        );
    });
};

const initialQuery = EuiSearchBar.Query.MATCH_ALL;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const SearchBar = ({
    searchPhrase,
    handleSearch,
}: {
    searchPhrase: string;
    handleSearch: (value: any) => void;
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [error, setError] = useState(null);
    console.log('query', query);
    console.log('error', error);

    const onChange = ({ query, error }) => {
        if (error) {
            setError(error);
        } else {
            setError(null);
            setQuery(query);
            handleSearch(query);
        }
    };

    const renderSearch = () => {
        const filters = [
            {
                type: 'field_value_toggle_group',
                field: 'insync',
                items: [
                    {
                        value: 'true',
                        name: 'Sync',
                    },
                    {
                        value: 'false',
                        name: 'Not sync',
                    },
                ],
            },
            {
                type: 'field_value_selection',
                field: 'tag',
                name: 'Tag',
                multiSelect: 'or',
                operator: 'exact',
                cache: 10000, // will cache the loaded tags for 10 sec
                options: () => loadTags(),
            },
        ];

        const schema = {
            strict: true,
            fields: {
                description: {
                    type: 'string',
                },
                insync: {
                    type: 'boolean',
                },
                status: {
                    type: 'string',
                },
                tag: {
                    type: 'string',
                    validate: (value) => {
                        if (
                            value !== '' &&
                            !tags.some((tag) => tag.name === value)
                        ) {
                            throw new Error(
                                `unknown tag (possible values: ${tags
                                    .map((tag) => tag.name)
                                    .join(',')})`,
                            );
                        }
                    },
                },
            },
        };

        return (
            <EuiSearchBar
                defaultQuery={initialQuery}
                box={{
                    // placeholder: 'insync:true',
                    placeholder: searchPhrase,
                    schema,
                }}
                // @ts-ignore
                filters={filters}
                onChange={onChange}
            />
        );
    };

    // const renderError = () => {
    //     if (!error) {
    //         return;
    //     }
    //     return (
    //         <Fragment>
    //             <EuiCallOut
    //                 iconType="faceSad"
    //                 color="danger"
    //                 title={`Invalid search: ${error.message}`}
    //             />
    //             <EuiSpacer size="l" />
    //         </Fragment>
    //     );
    // };

    // let esQueryDsl;
    // let esQueryString;
    //
    // try {
    //     esQueryDsl = EuiSearchBar.Query.toESQuery(query);
    // } catch (e) {
    //     esQueryDsl = e.toString();
    // }
    // try {
    //     esQueryString = EuiSearchBar.Query.toESQueryString(query);
    // } catch (e) {
    //     esQueryString = e.toString();
    // }

    return <>{renderSearch()}</>;
};
