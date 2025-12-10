import React from 'react';

import { capitalize } from 'lodash';
import type { PydanticFormElement } from 'pydantic-forms';

import { EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { snakeToHuman } from '@/utils';

import { getCommonFormFieldStyles, summaryFieldStyles } from './styles';
import { getNestedSummaryLabel } from './wfoPydanticFormUtils';

export const WfoSummary: PydanticFormElement = ({ pydanticFormField }) => {
    const { summaryFieldStyle } = useWithOrchestratorTheme(summaryFieldStyles);
    const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);

    const { id, title, description } = pydanticFormField;
    const uniforms = pydanticFormField.schema.uniforms;
    const summaryData = uniforms?.data as unknown as {
        headers: string[][];
        labels: string[];
        columns: string[][];
    };

    const headers = summaryData?.headers as string[][];
    const labels = summaryData?.labels as string[];
    const columns = summaryData?.columns || [];

    const extraColumnsData = columns.filter((_, index) => index !== 0);

    const rows = columns[0].map((row, index) => (
        <tr key={index}>
            {labels && (
                <td className={`label`}>
                    {getNestedSummaryLabel(labels, index)}
                </td>
            )}
            <td className={`value`}>
                {typeof row === 'string' && row.includes('<!doctype html>') ? (
                    <div
                        className="emailMessage"
                        dangerouslySetInnerHTML={{ __html: row }}
                    ></div>
                ) : (
                    row
                )}
            </td>
            {extraColumnsData &&
                extraColumnsData.map((_, idx) => (
                    <td className={`value`} key={idx}>
                        {extraColumnsData[idx][index]?.toString()}
                    </td>
                ))}
        </tr>
    ));

    const tableHeader =
        !headers || headers.length === 0 ? null : (
            <tr>
                {labels && <th />}
                {headers.map((header, idx) => (
                    <th key={idx}>{header}</th>
                ))}
            </tr>
        );

    const formattedTitle = snakeToHuman(capitalize(title ?? ''));

    return (
        <EuiFlexItem data-testid={id} css={[summaryFieldStyle, formRowStyle]}>
            <section>
                <EuiFormRow
                    label={<p className="label">{formattedTitle}</p>}
                    labelAppend={<EuiText size="m">{description}</EuiText>}
                    id={id}
                    fullWidth
                >
                    <section className="table-summary">
                        <table id={`${id}-table`}>
                            <thead>{tableHeader}</thead>
                            <tbody>{rows}</tbody>
                        </table>
                    </section>
                </EuiFormRow>
            </section>
        </EuiFlexItem>
    );
};
