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
import React, { useCallback, useEffect, useState } from 'react';
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

import { ipPrefixTableFieldStyling } from '@/components';
import { useIpBlocksQuery, usePrefixFiltersQuery } from '@/rtk/endpoints/ipam';
import type { Option } from '@/types';

import { prop } from '../types';
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

const IpPrefixTableField = ({
    id,
    name,
    onChange,
    onManualOverride,
    selected_prefix_id,
}: IProps) => {
    const [ipBlocks, setIpBlocks] = useState<IpBlock[]>([]);
    const [filteredPrefixes, setFilteredPrefixes] = useState<IpPrefix[]>([]);
    const [filter, setFilter] = useState<{
        state: number[];
        prefix?: IpPrefix;
    }>({
        state: [
            ipamStates.indexOf('Free'),
            ipamStates.indexOf('Allocated'),
            ipamStates.indexOf('Planned'),
            ipamStates.indexOf('Subnet'),
        ],
        prefix: undefined,
    });
    const [sorted] = useState<SortOption<SortKeys>>({
        name: 'prefix',
        descending: false,
    });
    const [manualOverrideVisible, setManualOverrideVisible] =
        useState<boolean>(false);
    const [manualOverrideValue, setManualOverrideValue] = useState<string>('');
    const [selectionDone, setSelectionDone] = useState<boolean>(false);
    const [parentPrefix, setParentPrefix] = useState<number>(1);
    const { data: prefixFiltersData } = usePrefixFiltersQuery();
    const { data: ipBlocksData, isFetching } = useIpBlocksQuery({
        parentPrefix: parentPrefix,
    });

    useEffect(() => {
        if (prefixFiltersData) {
            setFilteredPrefixes(prefixFiltersData);
            setFilter((prevFilter) => ({
                ...prevFilter,
                prefix: prefixFiltersData[0],
            }));
        }
    }, [prefixFiltersData]);

    useEffect(() => {
        if (ipBlocksData) {
            const selectedPrefix = filteredPrefixes.find(
                (prefix) => prefix.id === parentPrefix,
            );
            setIpBlocks(ipBlocksData);
            setFilter((prevFilter) => ({
                ...prevFilter,
                prefix: selectedPrefix || prevFilter.prefix,
            }));
        }
    }, [ipBlocksData, prefixFiltersData, filteredPrefixes, parentPrefix]);

    const filterAndSortBlocks = useCallback(() => {
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
        filteredIpBlocks.sort(sortBy(sorted.name));
        return sorted.descending
            ? filteredIpBlocks.reverse()
            : filteredIpBlocks;
    }, [filter, ipBlocks, sorted.descending, sorted.name]);

    const filterParentPrefix = (e: SingleValue<Option>) => {
        const newParentPrefix = parseInt(e!.value, 10);
        setParentPrefix(newParentPrefix);
    };

    const sortBy =
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

    const filterState = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const stateFilter = parseInt(target.value, 10);

        const newFilter = { ...filter };
        if (target.checked) {
            newFilter.state.push(stateFilter);
        } else {
            newFilter.state = newFilter.state.filter((e) => e !== stateFilter);
        }
        setFilter(newFilter);
    };

    const selectPrefix = (prefix: IpBlock) => () => {
        if (prefix.state === 0 || prefix.state === 1) {
            setSelectionDone(true);
            onChange(prefix);
        }
    };
    const ipBlocksFiltered = filterAndSortBlocks();

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
                        onClick={selectPrefix(record)}
                        id={`select-prefix-${id}-button`}
                    >
                        Select
                    </EuiButton>
                ) : null,
        },
    ];

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
                onClick={() => setSelectionDone(false)}
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
                                setManualOverrideVisible(!manualOverrideVisible)
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
                                    Generating free spaces for a big IPv6 root
                                    prefix could yield an enormous list. If you
                                    know the address of a free subnet you can
                                    provide it here. The prefix will be created
                                    in the biggest existing prefix above it in
                                    one of the root prefixes.
                                </EuiText>
                            }
                            helpText="Example: 145.145.10/17"
                        >
                            <EuiFieldText
                                value={manualOverrideValue}
                                onChange={(e) =>
                                    setManualOverrideValue(e.target.value)
                                }
                            ></EuiFieldText>
                        </EuiFormRow>
                        <EuiButton
                            onClick={() =>
                                onManualOverride(manualOverrideValue)
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
                                    onChange={filterState}
                                    value={ipamStates.indexOf('Allocated')}
                                    checked={filter.state.includes(
                                        ipamStates.indexOf('Allocated'),
                                    )}
                                />
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiCheckbox
                                    id="checkbox-planned"
                                    label="Planned"
                                    name="checkbox-planned"
                                    onChange={filterState}
                                    value={ipamStates.indexOf('Planned')}
                                    checked={filter.state.includes(
                                        ipamStates.indexOf('Planned'),
                                    )}
                                />
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiCheckbox
                                    id="checkbox-free"
                                    label="Free"
                                    name="checkbox-free"
                                    onChange={filterState}
                                    value={ipamStates.indexOf('Free')}
                                    checked={filter.state.includes(
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
                                onChange={filterParentPrefix}
                                value={value}
                            />
                        </span>
                    </div>
                    <EuiInMemoryTable
                        id="test"
                        style={{ marginTop: '6px' }}
                        itemId="id"
                        tableCaption="Prefix table"
                        loading={isFetching}
                        items={ipBlocksFiltered}
                        columns={columns}
                        pagination={pagination}
                        sorting={true}
                    />
                </>
            )}
        </EuiFlexItem>
    );
};

export default IpPrefixTableField;
