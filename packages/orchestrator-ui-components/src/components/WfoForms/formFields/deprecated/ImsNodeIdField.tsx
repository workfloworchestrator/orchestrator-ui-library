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

import { get } from 'lodash';
import { useTranslations } from 'next-intl';
import { connectField, filterDOMProps } from 'uniforms';

import { useImsNodesQuery } from '@/rtk/endpoints/formFields';

import { SelectFieldProps, UnconnectedSelectField } from '../SelectField';
import { ImsNode } from './types';

export type ImsNodeIdFieldProps = {
    onChange: (value?: number | undefined) => void;
    value?: number;
    locationCode: string;
    status?: string;
    unsubscribedOnly?: boolean;
} & Omit<
    SelectFieldProps,
    | 'placeholder'
    | 'transform'
    | 'allowedValues'
    | 'onChange'
    | 'value'
    | 'name'
>;

declare module 'uniforms' {
    interface FilterDOMProps {
        locationCode: never;
        status: never;
        unsubscribedOnly: never;
    }
}
filterDOMProps.register('locationCode', 'status', 'unsubscribedOnly');

function ImsNodeId({
    value,
    onChange,
    locationCode,
    status = 'PL',
    unsubscribedOnly = true,
    ...props
}: ImsNodeIdFieldProps) {
    const t = useTranslations('pydanticForms');
    const [nodes, setNodes] = useState<ImsNode[]>([]);
    const { data, isLoading, error } = useImsNodesQuery(
        {
            locationCode,
            status,
            unsubscribedOnly,
        },
        { skip: !(locationCode && status) },
    );

    useEffect(() => {
        if (data) {
            setNodes(data);
        }
        if (error) {
            console.error(error);
        }
    }, [locationCode, status, unsubscribedOnly, data, error]);

    const placeholder =
        isLoading && locationCode
            ? t('widgets.node_select.nodes_loading')
            : nodes.length
              ? t('widgets.node_select.select_node')
              : t('forms.widgets.node_select.no_nodes_placeholder');

    const imsNodeIdLabelLookup =
        nodes?.reduce<{ [index: string]: string }>(function (mapping, node) {
            mapping[node.id.toString()] = node.name;
            return mapping;
        }, {}) ?? {};

    return (
        <UnconnectedSelectField
            name=""
            {...props}
            allowedValues={Object.keys(imsNodeIdLabelLookup)}
            value={value?.toString()}
            transform={(id: string) => get(imsNodeIdLabelLookup, id, id)}
            onChange={
                ((str: string) => onChange(parseInt(str, 10))) as unknown as (
                    v: string | string[] | undefined,
                ) => void
            }
            placeholder={placeholder}
        />
    );
}

export const ImsNodeIdField = connectField(ImsNodeId, { kind: 'leaf' });
