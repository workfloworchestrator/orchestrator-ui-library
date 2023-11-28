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

import { FieldProps, connectField, filterDOMProps } from 'uniforms';

import { EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';

import { getStyles } from '@/components/WfoForms/formFields/SummaryFieldStyling';
import { useWithOrchestratorTheme } from '@/hooks';

export type SummaryFieldProps = FieldProps<
    null,
    {
        description?: string;
        data?: { headers: string[]; labels: string[]; columns: string[][] };
    }
>;

// onChange not used on purpose
function Summary({
    id,
    label,
    description,
    data,
    ...props
}: SummaryFieldProps) {
    const { summaryFieldStyle } = useWithOrchestratorTheme(getStyles);

    if (!data) {
        return null;
    }

    const { headers, labels, columns } = data;

    const extra_columns_data = columns.filter((_, index) => index !== 0);

    const rows = columns[0].map((row, index) => (
        <tr key={index}>
            {labels && <td className={`label`}>{labels[index]}</td>}
            <td className={`value`}>
                {row.includes('<!doctype html>') ? (
                    <div
                        className="emailMessage"
                        dangerouslySetInnerHTML={{ __html: row }}
                    ></div>
                ) : (
                    row
                )}
            </td>
            {extra_columns_data &&
                extra_columns_data.map((_, idx) => (
                    <td className={`value`} key={idx}>
                        {extra_columns_data[idx][index]}
                    </td>
                ))}
        </tr>
    ));

    const table_header =
        headers.length === 0 ? null : (
            <tr>
                {labels && <th />}
                {headers.map((header, idx) => (
                    <th key={idx}>{header}</th>
                ))}
            </tr>
        );

    return (
        <EuiFlexItem css={summaryFieldStyle}>
            <section {...filterDOMProps(props)}>
                <EuiFormRow
                    label={label}
                    labelAppend={<EuiText size="m">{description}</EuiText>}
                    id={id}
                    fullWidth
                >
                    <section className="table-summary">
                        <table id={`${id}-table`}>
                            <thead>{table_header}</thead>
                            <tbody>{rows}</tbody>
                        </table>
                    </section>
                </EuiFormRow>
            </section>
        </EuiFlexItem>
    );
}

export const SummaryField = connectField(Summary, { kind: 'leaf' });
