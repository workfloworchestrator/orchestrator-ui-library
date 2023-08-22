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

import { EuiFlexItem, EuiFormRow, EuiText } from "@elastic/eui";
import { summaryFieldStyling } from "lib/uniforms-surfnet/src/SummaryFieldStyling";
import { FieldProps } from "lib/uniforms-surfnet/src/types";
import React, { useContext } from "react";
import ReactHtmlParser from "react-html-parser";
import { connectField, filterDOMProps } from "uniforms";
import ApplicationContext from "utils/ApplicationContext";
import { isEmpty } from "utils/Utils";

export type SummaryFieldProps = FieldProps<
    null,
    { data?: { headers: string[]; labels: string[]; columns: string[][] } }
>;

// onChange not used on purpose
function Summary({ id, name, label, description, onChange, data, ...props }: SummaryFieldProps) {
    const { theme } = useContext(ApplicationContext);
    if (!data) {
        return null;
    }

    const { headers, labels, columns } = data;

    const extra_columns_data = columns.filter((item, index) => index !== 0);

    const rows = columns[0].map((row, index) => (
        <tr key={index}>
            {labels && <td className={`label ${theme}`}>{labels[index]}</td>}
            <td className={`value ${theme}`}>
                {typeof row == "string" && row.includes("<!doctype html>") ? (
                    <div className="emailMessage">{ReactHtmlParser(row)}</div>
                ) : (
                    row
                )}
            </td>
            {extra_columns_data &&
                extra_columns_data.map((cell, idx) => (
                    <td className={`value ${theme}`} key={idx}>
                        {extra_columns_data[idx][index]}
                    </td>
                ))}
        </tr>
    ));

    const table_header = isEmpty(headers) ? null : (
        <tr>
            {labels && <th />}
            {headers.map((header, idx) => (
                <th key={idx}>{header}</th>
            ))}
        </tr>
    );

    return (
        <EuiFlexItem css={summaryFieldStyling}>
            <section {...filterDOMProps(props)}>
                <EuiFormRow label={label} labelAppend={<EuiText size="m">{description}</EuiText>} id={id} fullWidth>
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

export default connectField(Summary, { kind: "leaf" });
