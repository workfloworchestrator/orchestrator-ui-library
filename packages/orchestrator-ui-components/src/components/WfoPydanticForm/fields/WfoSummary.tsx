import React from 'react';

import { capitalize } from 'lodash';
import {
  useGetConfig,
  useLabelProvider,
  type PydanticFormElement,
  type PydanticFormLabelProviderResponse,
} from 'pydantic-forms';

import { EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { snakeToHuman } from '@/utils';

import { getCommonFormFieldStyles, summaryFieldStyles } from './styles';
import { getNestedSummaryLabel } from './wfoPydanticFormUtils';

export const WfoSummary: PydanticFormElement = ({ pydanticFormField }) => {
  const { summaryFieldStyle } = useWithOrchestratorTheme(summaryFieldStyles);
  const { formRowStyle } = useWithOrchestratorTheme(getCommonFormFieldStyles);
  const config = useGetConfig()
  const { data }: { data: PydanticFormLabelProviderResponse | undefined } = useLabelProvider(config.labelProvider, 'temp', 'test');
  const rawLabels = data?.labels || { summary: {} };
  const labelTranslations: Record<string, string> = {
    ...(rawLabels as Record<string, string>),
    ...(rawLabels?.summary as Record<string, string>),
  };

  const translateSummaryField = (value: string) => {
    if (value in labelTranslations) {
      return labelTranslations[value];
    }

    const match = value.match(/^(.+)_(\d+)$/);
    if (!match) {
      return value;
    }
    const [, base, suffix] = match;

    if (base in labelTranslations) {
      return `${labelTranslations[base]} ${suffix}`;
    }

    return snakeToHuman(capitalize(value));
  };

  const { id, title, description } = pydanticFormField;
  const uniforms = pydanticFormField.schema.uniforms;
  const summaryData = uniforms?.data as unknown as {
    headers: string[];
    labels: string[];
    columns: string[][];
  };

  const headers = summaryData?.headers;
  const labels = summaryData?.labels;
  const columns = summaryData?.columns || [];

  const extraColumnsData = columns.filter((_, index) => index !== 0);

  const rows = columns[0].map((row, index) => (
    <tr key={index}>
      {labels && (
        <td className={`label`}>{translateSummaryField(getNestedSummaryLabel(labels, index))}</td>
      )}
      <td className={`value`}>
        {typeof row === 'string' && row.includes('<!doctype html>') ?
          <div className="emailMessage" dangerouslySetInnerHTML={{ __html: row }}></div>
        : row}
      </td>
      {extraColumnsData
        && extraColumnsData.map((_, idx) => (
          <td className={`value`} key={idx}>
            {extraColumnsData[idx][index]?.toString()}
          </td>
        ))}
    </tr>
  ));

  const tableHeader =
    !headers || headers.length === 0 ?
      null
    : <tr>
        {labels && <th />}
        {headers.map((header, idx) => (
          <th key={idx}>{translateSummaryField(header)}</th>
        ))}
      </tr>;

  const formattedTitle =
    title === 'MigrationSummaryValue' ?
      translateSummaryField(id)
    : snakeToHuman(capitalize(title ?? ''));

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
