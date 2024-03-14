/*
 * Copyright 2019-2023 SURF.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React from 'react';
import ReactSelect, { SingleValue } from 'react-select';

import {
    EuiBadge,
    EuiButton,
    EuiButtonIcon,
    EuiCheckbox,
    EuiFieldText,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
    EuiInMemoryTable,
    EuiPanel,
    EuiText,
} from '@elastic/eui';

import { ApiClientContext } from '@/contexts';

import { Option, prop } from '../types';
import { ipPrefixTableFieldStyling } from './IpPrefixTableFieldStyling';
import { IpBlock, IpPrefix, SortOption } from './types';
import { ipamStates } from './utils';

type SortKeys = 'id' | 'prefix' | 'description' | 'state_repr';

interface IProps {
    id: string;
    name: string;
    onChange: (prefix: IpBlock) => void;
    onManualOverride: (prefixString: string) => void;
    selected_prefix_id?: number;
}

interface IState {
    ipBlocks: IpBlock[];
    loading: boolean;
    filteredIpBlocks: IpBlock[];
    filteredPrefixes: IpPrefix[];
    filter: { state: number[]; prefix?: IpPrefix };
    sorted: SortOption<SortKeys>;
    manualOverrideVisible: boolean;
    manualOverrideValue: string;
    selectionDone: boolean;
}

export default class IpPrefixTableField extends React.PureComponent<IProps> {
    static contextType = ApiClientContext;
    context!: React.ContextType<typeof ApiClientContext>;
    state: IState = {
        ipBlocks: [],
        loading: true,
        filteredIpBlocks: [],
        filteredPrefixes: [],
        selectionDone: false,
        filter: {
            state: [
                ipamStates.indexOf('Free'),
                ipamStates.indexOf('Allocated'),
                ipamStates.indexOf('Planned'),
                ipamStates.indexOf('Subnet'),
            ],
            prefix: undefined,
        },
        sorted: {
            name: 'prefix',
            descending: false,
        },
        manualOverrideVisible: false,
        manualOverrideValue: '',
    };

    componentDidMount() {
        this.context.apiClient.prefix_filters().then((result: IpPrefix[]) => {
            const { filter } = this.state;
            filter.prefix = result[0];
            this.setState({
                filteredPrefixes: result,
                filter: filter,
                filteredIpBlocks: this.filterAndSortBlocks(),
            });
        });
        this.context.apiClient.ip_blocks(1).then((result: IpBlock[]) => {
            this.setState({ ipBlocks: result, loading: false });
        });
    }

    sort = (name: SortKeys) => (e: React.SyntheticEvent) => {
        if (e !== undefined && e !== null) {
            e.preventDefault();
            e.stopPropagation();
        }
        const sorted = { ...this.state.sorted };

        sorted.descending = sorted.name === name ? !sorted.descending : false;
        sorted.name = name;
        this.setState({
            sorted: sorted,
            filteredIpBlocks: this.filterAndSortBlocks(),
        });
    };

    sortBy =
        (name: SortKeys) =>
        (a: IpBlock, b: IpBlock): number => {
            const aVal = prop(a, name);
            const bVal = prop(b, name);
            try {
                return typeof aVal === 'string' && typeof bVal === 'string'
                    ? aVal.toLowerCase().localeCompare(bVal.toLowerCase())
                    : (aVal as number) - (bVal as number);
            } catch (e) {
                console.error(e);
            }
            return 0;
        };

    sortColumnIcon = (name: string, sorted: SortOption) => {
        if (sorted.name === name) {
            return (
                <i
                    className={
                        sorted.descending
                            ? 'fas fa-sort-down'
                            : 'fas fa-sort-up'
                    }
                />
            );
        }
        return <i />;
    };

    filterState = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const state_filter = parseInt(target.value, 10);
        const { filter } = this.state;
        if (target.checked) {
            filter.state.push(state_filter);
        } else {
            filter.state = filter.state.filter((e) => e !== state_filter);
        }
        this.setState({
            filter: filter,
            filteredIpBlocks: this.filterAndSortBlocks(),
        });
    };

    filterParentPrefix = (e: SingleValue<Option>) => {
        this.setState({ loading: true });
        const parentPrefix = parseInt(e!.value, 10);
        const { filter, filteredPrefixes } = this.state;
        let the_prefix: IpPrefix | undefined = undefined;
        filteredPrefixes.forEach(
            (prefix) =>
                (the_prefix =
                    prefix['id'] === parentPrefix ? prefix : the_prefix),
        );
        filter.prefix = the_prefix;
        this.context.apiClient
            .ip_blocks(parentPrefix)
            .then((result: IpBlock[]) => {
                this.setState({
                    ipBlocks: result,
                    filteredIpBlocks: this.filterAndSortBlocks(),
                    loading: false,
                    filter: filter,
                });
            });
    };

    filterAndSortBlocks() {
        const { filter, sorted, ipBlocks } = this.state;
        let filteredIpBlocks = ipBlocks;
        const keys = Object.keys(filter) as ('state' | 'prefix')[];
        keys.map((key) => {
            if (key === 'state') {
                filteredIpBlocks = filteredIpBlocks.filter((i) =>
                    filter[key].includes(i[key]),
                );
            } else if (key === 'prefix' && filter.prefix !== undefined) {
                filteredIpBlocks = filteredIpBlocks.filter(
                    (i) => i.parent === filter.prefix!.id,
                );
            } else if (key !== 'prefix') {
                filteredIpBlocks = filteredIpBlocks.filter(
                    (i) => prop(i, key) === prop(filter, key),
                );
            }
            return key;
        });
        filteredIpBlocks.sort(this.sortBy(sorted.name));
        return sorted.descending
            ? filteredIpBlocks.reverse()
            : filteredIpBlocks;
    }

    selectPrefix = (prefix: IpBlock) => () => {
        if (prefix.state === 0 || prefix.state === 1) {
            this.setState({ selectionDone: true });
            this.props.onChange(prefix);
        }
    };

    render() {
        const { id, name, selected_prefix_id } = this.props;
        const {
            filteredPrefixes,
            manualOverrideVisible,
            selectionDone,
            loading,
            manualOverrideValue,
        } = this.state;
        const ipBlocks = this.filterAndSortBlocks();

        const columns = [
            {
                field: 'id',
                name: 'ID',
                sortable: true,
                truncateText: true,
            },
            {
                field: 'prefix',
                name: 'Prefix',
                sortable: true,
            },
            {
                field: 'description',
                name: 'Description',
                truncateText: true,
                sortable: true,
            },
            {
                field: 'state',
                name: 'Status',
                sortable: true,
                render: (prefixState: number) => (
                    <EuiBadge color={prefixState === 3 ? 'danger' : 'success'}>
                        {ipamStates[prefixState]}
                    </EuiBadge>
                ),
            },
            {
                field: 'Action',
                name: '',
                render: (id: string, record: IpBlock) =>
                    record.state !== 3 ? (
                        <EuiButton
                            onClick={this.selectPrefix(record)}
                            id={`select-prefix-${id}-button`}
                        >
                            Select
                        </EuiButton>
                    ) : null,
            },
        ];

        const { state, prefix } = { ...this.state.filter };
        const parentPrefix = prefix?.id;

        const options: Option[] = filteredPrefixes.map((fp) => ({
            value: fp.id.toString(),
            label: fp.prefix,
        }));
        const value = options.find(
            (option) => option.value === parentPrefix?.toString(),
        );

        const pagination = {
            initialPageSize: 25,
            pageSizeOptions: [25, 50, 100, 250],
        };

        if (selected_prefix_id && selectionDone) {
            return (
                <EuiButton
                    id="undo-parent-prefix-choice-button"
                    iconType="editorUndo"
                    onClick={() => this.setState({ selectionDone: false })}
                >
                    Reset parent prefix choice
                </EuiButton>
            );
        }
        // Todo 482: re-implement when this component is refactored to function based
        // const customStyles = getReactSelectTheme(this.context.theme);

        return (
            <EuiFlexItem css={ipPrefixTableFieldStyling}>
                <div>
                    <EuiFlexGroup
                        gutterSize="s"
                        style={{ marginTop: '5px', marginBottom: '10px' }}
                    >
                        <EuiFlexItem grow={false}>
                            <EuiText>
                                <h4>Manual override?</h4>
                            </EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButtonIcon
                                iconType={
                                    manualOverrideVisible
                                        ? 'arrowDown'
                                        : 'arrowRight'
                                }
                                aria-label="Toggle manual override"
                                onClick={() =>
                                    this.setState({
                                        manualOverrideVisible:
                                            !manualOverrideVisible,
                                    })
                                }
                            />
                        </EuiFlexItem>
                        <EuiFlexItem></EuiFlexItem>
                    </EuiFlexGroup>
                    {manualOverrideVisible && (
                        <EuiPanel style={{ marginBottom: '20px' }}>
                            <EuiFormRow
                                style={{ marginTop: '15px' }}
                                label="Manually enter a prefix"
                                labelAppend={
                                    <EuiText size="m">
                                        Generating free spaces for a big IPv6
                                        root prefix could yield an enormous
                                        list. If you know the address of a free
                                        subnet you can provide it here. The
                                        prefix will be created in the biggest
                                        existing prefix above it in one of the
                                        root prefixes.
                                    </EuiText>
                                }
                                helpText="Example: 145.145.10/17"
                            >
                                <EuiFieldText
                                    value={manualOverrideValue}
                                    onChange={(e) =>
                                        this.setState({
                                            manualOverrideValue: e.target.value,
                                        })
                                    }
                                ></EuiFieldText>
                            </EuiFormRow>
                            <EuiButton
                                onClick={() =>
                                    this.props.onManualOverride(
                                        manualOverrideValue,
                                    )
                                }
                            >
                                Confirm
                            </EuiButton>
                        </EuiPanel>
                    )}
                </div>
                {!manualOverrideVisible && (
                    <>
                        <div>
                            <EuiFlexGroup gutterSize="s">
                                <EuiFlexItem
                                    grow={false}
                                    style={{ marginTop: '6px' }}
                                >
                                    State:
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiCheckbox
                                        id="checkbox-allocated"
                                        label="Allocated"
                                        name="checkbox-allocated"
                                        onChange={this.filterState}
                                        value={ipamStates.indexOf('Allocated')}
                                        checked={state.includes(
                                            ipamStates.indexOf('Allocated'),
                                        )}
                                    />
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiCheckbox
                                        id="checkbox-planned"
                                        label="Planned"
                                        name="checkbox-planned"
                                        onChange={this.filterState}
                                        value={ipamStates.indexOf('Planned')}
                                        checked={state.includes(
                                            ipamStates.indexOf('Planned'),
                                        )}
                                    />
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiCheckbox
                                        id="checkbox-free"
                                        label="Free"
                                        name="checkbox-free"
                                        onChange={this.filterState}
                                        value={ipamStates.indexOf('Free')}
                                        checked={state.includes(
                                            ipamStates.indexOf('Free'),
                                        )}
                                    />
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            <div
                                style={{
                                    marginTop: '4px',
                                    marginBottom: '4px',
                                }}
                            >
                                Root filter
                            </div>
                            <span>
                                <ReactSelect
                                    id={`${id}.root-filter`}
                                    // Todo 482: re-implement when this component is refactored to function based
                                    // styles={customStyles}
                                    inputId={`${id}.root-filter.search`}
                                    name={`${name}.root-filter`}
                                    options={options}
                                    onChange={this.filterParentPrefix}
                                    value={value}
                                />
                            </span>
                        </div>
                        <EuiInMemoryTable
                            id="test"
                            style={{ marginTop: '6px' }}
                            itemId="id"
                            tableCaption="Prefix table"
                            loading={loading}
                            items={ipBlocks}
                            columns={columns}
                            pagination={pagination}
                            sorting={true}
                        />
                    </>
                )}
            </EuiFlexItem>
        );
    }
}
