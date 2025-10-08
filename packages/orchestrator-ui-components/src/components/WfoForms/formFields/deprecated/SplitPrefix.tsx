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
import React, { useEffect, useState } from 'react';
import ReactSelect, { SingleValue } from 'react-select';

import { range } from 'lodash';

import { EuiFlexItem } from '@elastic/eui';

import { splitPrefixStyling } from '@/components';
import { useFreeSubnetsQuery } from '@/rtk/endpoints/ipam';
import type { Option } from '@/types';

interface IProps {
    id: string;
    name: string;
    subnet: string;
    prefixlen: number;
    prefixMin: number;
    onChange: (value: string) => void;
    selectedSubnet?: string;
}

const SplitPrefix: React.FC<IProps> = ({
    id,
    name,
    subnet,
    prefixlen,
    prefixMin,
    onChange,
    selectedSubnet,
}) => {
    const [subnets, setSubnets] = useState<string[]>([]);
    const [desiredPrefixlen, setDesiredPrefixlen] = useState<number>(prefixMin);
    const { data, isFetching } = useFreeSubnetsQuery({
        subnet,
        netmask: prefixlen,
        prefixLen: desiredPrefixlen,
    });

    useEffect(() => {
        if (isFetching) {
            setSubnets([]);
        }
        if (data) {
            const filteredSubnets = data.filter(
                (x) => parseInt(x.split('/')[1], 10) === desiredPrefixlen,
            );
            setSubnets(filteredSubnets);
            setDesiredPrefixlen(desiredPrefixlen);
        }
    }, [data, desiredPrefixlen, isFetching]);

    const changePrefixLength = (e: SingleValue<Option<number>>) => {
        const desiredPrefixlen = e?.value;
        if (desiredPrefixlen) {
            setDesiredPrefixlen(desiredPrefixlen);
        }
    };

    const selectSubnet = (e: SingleValue<Option>) => {
        onChange(e?.value ?? '');
    };

    // IPv4 subnet size should be between /32 and /12
    // IPv6 subnet size should be between /128 and /32
    const version = subnet.indexOf(':') === -1 ? 4 : 6;
    const minPrefixLength = version === 4 ? 12 : 32;
    const minimalSelectablePrefixLength =
        minPrefixLength > prefixMin ? minPrefixLength : prefixMin;
    const maximalSelectablePrefixLength =
        version === 4 ? 32 : minimalSelectablePrefixLength + 12;

    const prefixlengths = range(
        maximalSelectablePrefixLength - minimalSelectablePrefixLength + 1,
    ).map((x) => minimalSelectablePrefixLength + x);

    const length_options: Option<number>[] = prefixlengths.map((pl) => ({
        value: pl,
        label: pl.toString(),
    }));
    const length_value = length_options.find(
        (option) => option.value === desiredPrefixlen,
    );

    const prefix_options = subnets.map((sn) => ({
        label: sn,
        value: sn,
    }));

    const prefix_value = prefix_options.find(
        (option) => option.value === selectedSubnet,
    );

    return (
        <EuiFlexItem css={splitPrefixStyling}>
            <section>
                <h3>
                    Selected prefix: {subnet}/{prefixlen}
                </h3>
                <div>Desired netmask of the new subnet:</div>
                <ReactSelect
                    id={`${id}.desired-netmask`}
                    name={`${name}.desired-netmask`}
                    onChange={changePrefixLength}
                    options={length_options}
                    value={length_value}
                />
                <div>
                    <div>Desired prefix:</div>
                    <ReactSelect
                        isDisabled={isFetching}
                        isLoading={isFetching}
                        id={`${id}.desired-prefix`}
                        name={`${name}.desired-prefix`}
                        options={prefix_options}
                        onChange={selectSubnet}
                        value={prefix_value}
                    />
                </div>
            </section>
        </EuiFlexItem>
    );
};

export default SplitPrefix;
