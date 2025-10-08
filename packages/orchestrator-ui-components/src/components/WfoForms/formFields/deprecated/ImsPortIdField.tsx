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

import { useWithOrchestratorTheme } from '@/hooks';
import {
    useFreePortsByNodeSubscriptionIdAndSpeedQuery,
    useGetNodeSubscriptionOptionsQuery,
} from '@/rtk/endpoints/formFields';
import type { Option } from '@/types';

import { getSelectFieldStyles } from '../SelectField/styles';
import { FieldProps } from '../types';
import { imsPortIdFieldStyling } from './ImsPortIdFieldStyling';
import { ImsPort, NodeSubscriptionOption } from './types';

export type ImsPortFieldProps = FieldProps<
    number,
    {
        nodeSubscriptionId?: string;
        interfaceSpeed: number | string;
        imsPortMode?: 'patched' | 'unpatched' | 'all';
        nodeStatuses?: ('active' | 'provisioning')[];
    }
>;

function nodeToOptionCorelink(nodeOption: NodeSubscriptionOption): Option {
    return {
        value: nodeOption.subscriptionId,
        label: `${nodeOption.subscriptionId.substring(0, 8)} ${
            nodeOption.description.trim() || '<No description>'
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
    const [nodeId, setNodeId] = useState<number | string | undefined>(
        nodeSubscriptionId,
    );
    const [ports, setPorts] = useState<ImsPort[]>([]);

    const t = useTranslations('pydanticForms');
    // React select allows callbacks to supply style for innercomponents: https://react-select.com/styles#inner-components
    const { reactSelectInnerComponentStyles } =
        useWithOrchestratorTheme(getSelectFieldStyles);

    const {
        data: freePorts,
        error: freePortsError,
        isFetching: loading,
    } = useFreePortsByNodeSubscriptionIdAndSpeedQuery(
        {
            nodeSubscriptionId: nodeId as string,
            interfaceSpeed: interfaceSpeed as number,
            mode: imsPortMode,
        },
        {
            skip: !nodeId,
            refetchOnMountOrArgChange: true,
        },
    );

    const { data: nodeSubscriptionOptions } =
        useGetNodeSubscriptionOptionsQuery({
            statuses: nodeStatuses?.join('|') ?? 'active',
        });

    useEffect(() => {
        setPorts(freePorts ?? []);
    }, [freePorts, freePortsError]);

    const onChangeNodes = useCallback(
        (option: SingleValue<Option>) => {
            const value = option?.value;

            if (value === undefined) {
                return;
            }
            // Clears the value when another selection is made
            onChange(undefined);
            setNodeId(value);
            setPorts([]);
        },
        [onChange],
    );

    const nodesPlaceholder = loading
        ? t('widgets.nodePort.loadingNodes')
        : t('widgets.nodePort.selectNode');

    const portPlaceholder = loading
        ? t('widgets.nodePort.loadingPorts')
        : nodeId
          ? t('widgets.nodePort.selectPort')
          : t('widgets.nodePort.selectNodeFirst');

    const nodeOptions: Option[] =
        nodeSubscriptionOptions?.map(nodeToOptionCorelink) || [];

    nodeOptions.sort((x, y) => x.label.localeCompare(y.label));
    const nodeValue = nodeOptions.find(
        (option) => option.value === nodeId?.toString(),
    );

    const portOptions: Option<number>[] = ports
        .map((aPort) => ({
            value: aPort.id,
            label: `${aPort.port} (${aPort.status}) (${aPort.iface_type})`,
        }))
        .sort((x, y) => x.label.localeCompare(y.label));
    const portValue = portOptions.find((option) => option.value === value);
    return (
        <EuiFlexItem css={imsPortIdFieldStyling}>
            <section {...filterDOMProps(props)}>
                <EuiFormRow
                    label={label}
                    labelAppend={<EuiText size="m">{description} </EuiText>}
                    error={showInlineError ? errorMessage : false}
                    isInvalid={error}
                    id={id}
                    fullWidth
                >
                    {(!nodeValue && nodeSubscriptionId && (
                        <EuiText>
                            This Node subscription is missing. Please check the
                            nodes status: {nodeSubscriptionId}
                        </EuiText>
                    )) || (
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
                                        options={nodeOptions}
                                        placeholder={nodesPlaceholder}
                                        value={nodeValue}
                                        isSearchable={true}
                                        isDisabled={
                                            disabled ||
                                            readOnly ||
                                            nodeOptions.length === 0 ||
                                            !!nodeSubscriptionId
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
                                        options={portOptions}
                                        placeholder={portPlaceholder}
                                        value={portValue || null}
                                        isSearchable={true}
                                        isDisabled={
                                            disabled ||
                                            readOnly ||
                                            portOptions.length === 0
                                        }
                                        styles={reactSelectInnerComponentStyles}
                                    />
                                </EuiFormRow>
                            </div>
                        </section>
                    )}
                </EuiFormRow>
            </section>
        </EuiFlexItem>
    );
}

export const ImsPortIdField = connectField(ImsPortId, { kind: 'leaf' });
