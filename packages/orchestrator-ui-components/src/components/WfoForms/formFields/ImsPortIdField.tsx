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

import { useTranslations } from 'next-intl';
import { connectField, filterDOMProps } from 'uniforms';

import { EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';

import { getReactSelectInnerComponentStyles } from '@/components/WfoForms/formFields/reactSelectStyles';
import { useOrchestratorTheme } from '@/hooks';

import { useAxiosApiClient } from '../useAxiosApiClient';
import { imsPortIdFieldStyling } from './ImsPortIdFieldStyling';
import { ImsNode, ImsPort, NodeSubscription } from './surf/types';
import { FieldProps, Option } from './types';

export type ImsPortFieldProps = FieldProps<
    number,
    {
        nodeSubscriptionId?: string;
        interfaceSpeed: number | string;
        imsPortMode?: 'patched' | 'unpatched' | 'all';
        nodeStatuses?: ('active' | 'provisioning')[];
    }
>;

function nodeToOptionCorelink(node: NodeSubscription): Option {
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
    readOnly,
    error,
    showInlineError,
    errorMessage,
    nodeSubscriptionId,
    interfaceSpeed,
    imsPortMode = 'all',
    nodeStatuses,
    ...props
}: ImsPortFieldProps) {
    const apiClient = useAxiosApiClient();
    const t = useTranslations('pydanticForms');
    const { theme } = useOrchestratorTheme();
    // React select allows callbacks to supply style for innercomponents: https://react-select.com/styles#inner-components
    const reactSelectInnerComponentStyles =
        getReactSelectInnerComponentStyles(theme);

    const [nodes, setNodes] = useState<ImsNode[] | NodeSubscription[]>([]);
    const [nodeId, setNodeId] = useState<number | string | undefined>(
        nodeSubscriptionId,
    );
    const [ports, setPorts] = useState<ImsPort[]>([]);
    const [loading, setLoading] = useState(true);

    const onChangeNodes = useCallback(
        (option: SingleValue<Option>) => {
            const value = option?.value;

            if (value === undefined) {
                return;
            }

            setLoading(true);
            setNodeId(value);
            setPorts([]);

            apiClient
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
        [interfaceSpeed, imsPortMode, apiClient],
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
        ? t('widgets.nodePort.loadingNodes')
        : t('widgets.nodePort.selectNode');

    const portPlaceholder = loading
        ? t('widgets.nodePort.loadingPorts')
        : nodeId
          ? t('widgets.nodePort.selectPort')
          : t('widgets.nodePort.selectNodeFirst');

    const node_options: Option[] = (nodes as NodeSubscription[]).map(
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
                                    styles={reactSelectInnerComponentStyles}
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
                                    styles={reactSelectInnerComponentStyles}
                                />
                            </EuiFormRow>
                        </div>
                    </section>
                </EuiFormRow>
            </section>
        </EuiFlexItem>
    );
}

export const ImsPortIdField = connectField(ImsPortId, { kind: 'leaf' });
