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
import { EuiCallOut, EuiFormRow, EuiText } from '@elastic/eui';
import { useTranslations } from 'next-intl';

import { FieldProps } from './types';
import { IpBlock } from './surf/types';
import IpPrefixTableField from './IpPrefixTableField';
import SplitPrefix from './SplitPrefix';

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
    const t = useTranslations('pydanticForms');
    const [selectedPrefix, setSelectedPrefix] = useState<IpBlock | undefined>(
        undefined,
    );
    const [manualOverride, setManualOverride] = useState(false);

    const usePrefix = selectedPrefix?.prefix ?? value;
    const [subnet, netmask] = usePrefix?.split('/') ?? ['', ''];
    const usedPrefixMin =
        prefixMin ??
        parseInt(netmask, 10) + (selectedPrefix?.state === 0 ? 0 : 1);

    return (
        <section {...filterDOMProps(props)}>
            <EuiFormRow
                label={label}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                error={showInlineError ? errorMessage : false}
                isInvalid={error}
                id={id}
                fullWidth
            >
                <section className="ipblock-selector">
                    <div id={id}>
                        {!prefixMin && (
                            <IpPrefixTableField
                                id={id}
                                name={name}
                                onChange={(prefix: IpBlock) => {
                                    if (!readOnly) {
                                        if (
                                            prefix.state === 0 ||
                                            prefix.state === 1
                                        ) {
                                            setSelectedPrefix(prefix);
                                        }
                                        setManualOverride(false);
                                        onChange(prefix.prefix);
                                    }
                                }}
                                onManualOverride={(prefixString: string) => {
                                    if (!readOnly) {
                                        setManualOverride(true);
                                        onChange(prefixString);
                                    }
                                }}
                                selected_prefix_id={selectedPrefix?.id}
                            />
                        )}
                        {usePrefix && !manualOverride && (
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
                        {usePrefix && manualOverride && (
                            <EuiCallOut
                                title={t(
                                    'widgets.ipvAnyNetworkField.manuallySelectedPrefix',
                                )}
                                color="primary"
                                iconType="check"
                            >
                                <p>{value}</p>
                            </EuiCallOut>
                        )}
                    </div>
                </section>
            </EuiFormRow>
        </section>
    );
}

export const IpNetworkField = connectField(IpNetwork, { kind: 'leaf' });
