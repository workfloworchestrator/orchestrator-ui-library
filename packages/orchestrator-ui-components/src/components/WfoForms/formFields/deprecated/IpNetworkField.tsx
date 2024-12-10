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
import React, { useState } from 'react';

import { connectField, filterDOMProps } from 'uniforms';

import { EuiFormRow, EuiText } from '@elastic/eui';

import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import SplitPrefix from '@/components/WfoForms/formFields/deprecated/SplitPrefix';
import { useWithOrchestratorTheme } from '@/hooks';

import { FieldProps } from '../types';

export function getUsedPrefixMin(
    netmask: string,
    prefixMin: number | undefined,
    name: string,
) {
    const netMaskInt = parseInt(netmask, 10);
    return (
        prefixMin ??
        (netMaskInt < 32 && name === 'ip_sub_prefix'
            ? netMaskInt + 1
            : netMaskInt)
    );
}

export type IPvAnyNetworkFieldProps = FieldProps<
    string,
    { prefixMin?: number }
>;

function IpNetwork({
    id,
    label,
    description,
    name,
    onChange,
    readOnly,
    value,
    error,
    showInlineError,
    errorMessage,
    prefixMin,
    ...props
}: IPvAnyNetworkFieldProps) {
    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);

    // The state is needed in order to keep the selected prefix in the SplitPrefix component
    const [selectedPrefix] = useState<string | undefined>(value);

    const usePrefix = selectedPrefix;
    const [subnet, netmask] = usePrefix?.split('/') ?? ['', ''];

    const usedPrefixMin = getUsedPrefixMin(netmask, prefixMin, name);

    return (
        <section {...filterDOMProps(props)}>
            <EuiFormRow
                css={formRowStyle}
                label={label}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                error={showInlineError ? errorMessage : false}
                isInvalid={error}
                id={id}
                fullWidth
            >
                <section className="ipblock-selector">
                    <div id={id}>
                        {usePrefix && (
                            <SplitPrefix
                                id={id}
                                name={name}
                                subnet={subnet}
                                prefixlen={parseInt(netmask, 10)}
                                prefixMin={usedPrefixMin}
                                onChange={(prefix: string) => {
                                    if (!readOnly) {
                                        onChange(prefix);
                                    }
                                }}
                                selectedSubnet={usePrefix}
                            />
                        )}
                    </div>
                </section>
            </EuiFormRow>
        </section>
    );
}

export const IpNetworkField = connectField(IpNetwork, { kind: 'leaf' });
