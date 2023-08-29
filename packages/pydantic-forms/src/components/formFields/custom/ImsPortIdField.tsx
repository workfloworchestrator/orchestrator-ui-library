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

import { EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';
import { FieldProps } from 'lib/uniforms-surfnet/src/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import ReactSelect, { SingleValue } from 'react-select';
import { getReactSelectTheme } from 'stylesheets/emotion/utils';
import { connectField, filterDOMProps } from 'uniforms';
import ApplicationContext from 'utils/ApplicationContext';
import { IMSNode, IMSPort, Option, Subscription } from 'utils/types';

import { imsPortIdFieldStyling } from './ImsPortIdFieldStyling';

export type ImsPortFieldProps = FieldProps<
    number,
    {
        nodeSubscriptionId?: string;
        interfaceSpeed: number | string;
        imsPortMode?: 'patched' | 'unpatched' | 'all';
        nodeStatuses?: ('active' | 'provisioning')[];
    } & WrappedComponentProps
>;

function nodeToOptionCorelink(node: Subscription): Option {
    return {
        value: node.subscription_id,
        label: `${node.subscription_id.substring(0, 8)} ${
            node.description.trim() || '<No description>'
        }`,
    };
}

declare module 'uniforms' {
    interface FilterDOMProps {
        nodeSubscriptionId: never;
        interfaceSpeed: never;
        nodeStatuses: never;
        imsPortMode: never;
    }
}
filterDOMProps.register(
    'nodeSubscriptionId',
    'interfaceSpeed',
    'nodeStatuses',
    'imsPortMode',
);

function ImsPortId({
    id,
    name,
    label,
    description,
    onChange,
    value,
    disabled,
    placeholder,
    readOnly,
    error,
    showInlineError,
    errorMessage,
    nodeSubscriptionId,
    interfaceSpeed,
    imsPortMode = 'all',
    nodeStatuses,
    intl,
    ...props
}: ImsPortFieldProps) {
    const { apiClient, customApiClient, theme } =
        useContext(ApplicationContext);

    const [nodes, setNodes] = useState<IMSNode[] | Subscription[]>([]);
    const [nodeId, setNodeId] = useState<number | string | undefined>(
        nodeSubscriptionId,
    );
    const [ports, setPorts] = useState<IMSPort[]>([]);
    const [loading, setLoading] = useState(true);

    const onChangeNodes = useCallback(
        (option: SingleValue<Option>) => {
            let value = option?.value;

            if (value === undefined) {
                return;
            }

            setLoading(true);
            setNodeId(value);
            setPorts([]);

            customApiClient
                .getFreePortsByNodeSubscriptionIdAndSpeed(
                    value as string,
                    interfaceSpeed as number,
                    imsPortMode,
                )
                .then((result) => {
                    setPorts(result);
                    setLoading(false);
                });
        },
        [interfaceSpeed, imsPortMode, customApiClient],
    );

    useEffect(() => {
        setLoading(true);

        const nodesPromise = apiClient.nodeSubscriptions(
            nodeStatuses ?? ['active'],
        );
        if (nodeSubscriptionId) {
            nodesPromise.then((result) => {
                setNodes(
                    result.filter(
                        (subscription) =>
                            subscription.subscription_id === nodeSubscriptionId,
                    ),
                );
                setLoading(false);
                onChangeNodes({ value: nodeSubscriptionId } as Option);
            });
        } else {
            nodesPromise.then((result) => {
                setNodes(result);
                setLoading(false);
            });
        }
    }, [onChangeNodes, nodeStatuses, nodeSubscriptionId, apiClient]);
    const nodesPlaceholder = loading
        ? intl.formatMessage({ id: 'forms.widgets.nodePort.loading' })
        : intl.formatMessage({ id: 'forms.widgets.nodePort.selectNode' });

    const portPlaceholder = loading
        ? intl.formatMessage({ id: 'forms.widgets.nodePort.loading' })
        : nodeId
        ? intl.formatMessage({ id: 'forms.widgets.nodePort.selectPort' })
        : intl.formatMessage({ id: 'forms.widgets.nodePort.selectNodeFirst' });

    let node_options: Option[] = (nodes as Subscription[]).map(
        nodeToOptionCorelink,
    );

    node_options.sort((x, y) => x.label.localeCompare(y.label));
    const node_value = node_options.find(
        (option) => option.value === nodeId?.toString(),
    );

    const port_options: Option<number>[] = ports
        .map((aPort) => ({
            value: aPort.id,
            label: `${aPort.port} (${aPort.status}) (${aPort.iface_type})`,
        }))
        .sort((x, y) => x.label.localeCompare(y.label));
    const port_value = port_options.find((option) => option.value === value);

    const customStyles = getReactSelectTheme(theme);

    return (
        <EuiFlexItem css={imsPortIdFieldStyling}>
            <section {...filterDOMProps(props)}>
                <EuiFormRow
                    label={label}
                    labelAppend={<EuiText size="m">{description}</EuiText>}
                    error={showInlineError ? errorMessage : false}
                    isInvalid={error}
                    id={id}
                    fullWidth
                >
                    <section className="node-port">
                        <div className="node-select">
                            <EuiFormRow
                                label="Node"
                                id={`${id}.node`}
                                fullWidth
                            >
                                <ReactSelect<Option, false>
                                    inputId={`${id}.node.search`}
                                    name={`${name}.node`}
                                    onChange={onChangeNodes}
                                    options={node_options}
                                    placeholder={nodesPlaceholder}
                                    value={node_value}
                                    isSearchable={true}
                                    isDisabled={
                                        disabled ||
                                        readOnly ||
                                        !!nodeSubscriptionId ||
                                        nodes.length === 0
                                    }
                                    styles={customStyles}
                                />
                            </EuiFormRow>
                        </div>
                        <div className="port-select">
                            <EuiFormRow label="Port" id={id} fullWidth>
                                <ReactSelect<Option<number>, false>
                                    inputId={`${id}.search`}
                                    name={name}
                                    onChange={(selected) => {
                                        onChange(selected?.value);
                                    }}
                                    options={port_options}
                                    placeholder={portPlaceholder}
                                    value={port_value}
                                    isSearchable={true}
                                    isDisabled={
                                        disabled ||
                                        readOnly ||
                                        ports.length === 0
                                    }
                                    styles={customStyles}
                                />
                            </EuiFormRow>
                        </div>
                    </section>
                </EuiFormRow>
            </section>
        </EuiFlexItem>
    );
}

export default connectField(injectIntl(ImsPortId), { kind: 'leaf' });
