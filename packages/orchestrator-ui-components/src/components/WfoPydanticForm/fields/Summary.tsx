import React from 'react';

import type { PydanticFormElement } from 'pydantic-forms';

import { EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';
import { tint } from '@elastic/eui';
import { css } from '@emotion/react';
import type { WfoTheme } from '@orchestrator-ui/orchestrator-ui-components';

import { getCommonFormFieldStyles } from '@/components/WfoForms/formFields/commonStyles';
import { useWithOrchestratorTheme } from '@/hooks';

export const getStyles = ({ theme }: WfoTheme) => {
    const toShadeColor = (color: string) => tint(color, 0.9);

    const summaryFieldStyle = css({
        'div.emailMessage': {
            td: {
                color: theme.colors.text,
            },
            p: {
                color: theme.colors.text,
            },
            html: {
                marginLeft: '-10px',
            },
        },
        'section.table-summary': {
            marginTop: '20px',
            width: '100%',
            td: {
                padding: '10px',
                verticalAlign: 'top',
            },
            'td:not(:first-child):not(:last-child)': {
                borderRight: `1px solid ${theme.colors.lightestShade}`,
            },
            '.label': {
                fontWeight: 'bold',
                color: theme.colors.lightestShade,
                backgroundColor: theme.colors.primary,
                borderRight: `2px solid ${theme.colors.lightestShade}`,
                borderBottom: `1px solid ${theme.colors.lightestShade}`,
            },
            '.value': {
                backgroundColor: toShadeColor(theme.colors.primary),
                borderBottom: `1px solid ${theme.colors.lightestShade}`,
            },
        },
    });
    return {
        summaryFieldStyle: summaryFieldStyle,
    };
};

export const Summary: PydanticFormElement = ({ pydanticFormField }) => {
    const { summaryFieldStyle } = useWithOrchestratorTheme(getStyles);
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

    const rows =
        columns &&
        columns[0] &&
        columns[0].map((row, index) => (
            <tr key={index}>
                {labels && <td className={`label`}>{labels[index]}</td>}
                <td className={`value`}>
                    {typeof row === 'string' &&
                    row.includes('<!doctype html>') ? (
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
                            {extraColumnsData[idx][index]}
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

    return (
        <EuiFlexItem css={[summaryFieldStyle, formRowStyle]}>
            <section>
                <EuiFormRow
                    label={description}
                    labelAppend={<EuiText size="m">{title}</EuiText>}
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
