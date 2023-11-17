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

import { EuiFlexItem } from "@elastic/eui";
import { range } from "lodash";
import React from "react";
import ReactSelect, { SingleValue } from "react-select";
import { getReactSelectTheme } from "stylesheets/emotion/utils";
import ApplicationContext from "utils/ApplicationContext";
import { Option } from "utils/types";

import { splitPrefixStyling } from "./SplitPrefixStyling";

interface IProps {
    id: string;
    name: string;
    subnet: string;
    prefixlen: number;
    prefixMin: number;
    onChange: (value: string) => void;
    selectedSubnet?: string;
}

interface IState {
    subnets: [];
    desiredPrefixlen: number;
}

export default class SplitPrefix extends React.PureComponent<IProps> {
    static contextType = ApplicationContext;
    context!: React.ContextType<typeof ApplicationContext>;
    state: IState = {
        subnets: [],
        desiredPrefixlen: 0,
    };

    fetchFreePrefixes(subnet: string, prefixlen: number, desiredPrefixlen: number) {
        this.context.customApiClient.free_subnets(subnet, prefixlen, desiredPrefixlen).then((result: string[]) => {
            let subnets = result.filter((x) => parseInt(x.split("/")[1], 10) === desiredPrefixlen);
            this.setState({
                subnets: subnets,
                desiredPrefixlen: desiredPrefixlen,
                loading: false,
            });
        });
    }

    componentDidUpdate(prevProps: IProps) {
        if (this.props.subnet !== prevProps.subnet || this.props.prefixlen !== prevProps.prefixlen) {
            this.fetchFreePrefixes(this.props.subnet, this.props.prefixlen, this.props.prefixMin);
        }
    }

    componentDidMount() {
        const { subnet, prefixlen, prefixMin } = { ...this.props };

        this.fetchFreePrefixes(subnet, prefixlen, prefixMin);
    }

    changePrefixLength = (e: SingleValue<Option<number>>) => {
        const { subnet, prefixlen } = { ...this.props };

        const desiredPrefixlen = e?.value;
        if (desiredPrefixlen) {
            this.fetchFreePrefixes(subnet, prefixlen, desiredPrefixlen);
        }
    };

    selectSubnet = (e: SingleValue<Option>) => {
        this.props.onChange(e?.value ?? "");
    };

    render() {
        const { id, name, subnet, prefixlen, prefixMin, selectedSubnet } = this.props;
        const version = subnet.indexOf(":") === -1 ? 4 : 6;
        const max_for_version = version === 4 ? 32 : 64;
        const { desiredPrefixlen } = this.state;
        const prefixlengths = range(max_for_version - prefixMin + 1).map((x) => prefixMin + x);
        const length_options: Option<number>[] = prefixlengths.map((pl) => ({ value: pl, label: pl.toString() }));
        const length_value = length_options.find((option) => option.value === desiredPrefixlen);

        const prefix_options = this.state.subnets.map((sn) => ({ label: sn, value: sn }));
        const prefix_value = prefix_options.find((option) => option.value === selectedSubnet);
        const customStyles = getReactSelectTheme(this.context.theme);

        return (
            <EuiFlexItem css={splitPrefixStyling}>
                <section>
                    <h3>
                        Selected prefix: {subnet}/{prefixlen}
                    </h3>
                    <div>Desired netmask of the new subnet:</div>
                    <ReactSelect
                        id={`${id}.desired-netmask`}
                        styles={customStyles}
                        inputId={`${id}.desired-netmask.search`}
                        name={`${name}.desired-netmask`}
                        onChange={this.changePrefixLength}
                        options={length_options}
                        value={length_value}
                    />
                    {this.state.subnets && (
                        <div>
                            <div>Desired prefix:</div>
                            <ReactSelect
                                id={`${id}.desired-prefix`}
                                styles={customStyles}
                                inputId={`${id}.desired-prefix.search`}
                                name={`${name}.desired-prefix`}
                                options={prefix_options}
                                onChange={this.selectSubnet}
                                value={prefix_value}
                            />
                        </div>
                    )}
                </section>
            </EuiFlexItem>
        );
    }
}
