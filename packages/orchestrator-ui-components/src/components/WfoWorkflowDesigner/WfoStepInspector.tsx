import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiBadge,
  EuiDescriptionList,
  EuiFieldNumber,
  EuiFieldText,
  EuiFormRow,
  EuiPanel,
  EuiSelect,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiTextArea,
  EuiTitle,
} from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { WorkflowDesignerIssue, WorkflowDesignerJsonSchema, WorkflowDesignerStep } from '@/types';

import { getWorkflowDesignerStyles } from './styles';
import { typeLabel } from './utils';

export type WfoStepInspectorProps = {
  step: WorkflowDesignerStep;
  config?: Record<string, unknown>;
  issues?: WorkflowDesignerIssue[];
  onConfigChange?: (config: Record<string, unknown>) => void;
};

type SchemaProperty = NonNullable<WorkflowDesignerJsonSchema['properties']>[string];

const propertyType = (property: SchemaProperty): string | undefined =>
  property.type ?? property.anyOf?.map((option) => option.type).find((type) => type && type !== 'null');

const ConfigField: FC<{
  name: string;
  property: SchemaProperty;
  value: unknown;
  onChange: (value: unknown) => void;
}> = ({ name, property, value, onChange }) => {
  const label = property.title ?? name;
  const current = value ?? property.default ?? '';
  let input: React.ReactElement;
  if (property.enum) {
    input = (
      <EuiSelect
        compressed
        value={String(current)}
        options={property.enum.map((option) => ({ value: option, text: option }))}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (propertyType(property) === 'boolean') {
    input = (
      <EuiSwitch compressed label={label} checked={Boolean(current)} onChange={(e) => onChange(e.target.checked)} />
    );
  } else if (propertyType(property) === 'integer' || propertyType(property) === 'number') {
    input = <EuiFieldNumber compressed value={Number(current)} onChange={(e) => onChange(Number(e.target.value))} />;
  } else if (name === 'template' || name === 'message') {
    input = (
      <EuiTextArea compressed rows={3} fullWidth value={String(current)} onChange={(e) => onChange(e.target.value)} />
    );
  } else {
    input = <EuiFieldText compressed fullWidth value={String(current)} onChange={(e) => onChange(e.target.value)} />;
  }
  return (
    <EuiFormRow label={label} helpText={property.description} fullWidth display="rowCompressed">
      {input}
    </EuiFormRow>
  );
};

export const WfoStepInspector: FC<WfoStepInspectorProps> = ({ step, config, issues = [], onConfigChange }) => {
  const t = useTranslations('workflowDesigner.inspector');
  const { monospaceStyle } = useWithOrchestratorTheme(getWorkflowDesignerStyles);
  const properties = step.config_schema?.properties ?? {};
  const guaranteedOutputs = step.outputs.filter((output) => output.guaranteed);

  return (
    <EuiPanel hasBorder paddingSize="m">
      <EuiTitle size="xs">
        <h3>{step.name}</h3>
      </EuiTitle>
      <EuiText size="xs" color="subdued" css={monospaceStyle}>
        {step.kind === 'helper' ? t('helper') : step.id}
      </EuiText>
      {step.description && (
        <>
          <EuiSpacer size="s" />
          <EuiText size="s">{step.description}</EuiText>
        </>
      )}
      {!step.usable && (
        <>
          <EuiSpacer size="s" />
          <EuiText size="s" color="danger">
            {t('unusable', { reason: step.unusable_reason ?? '' })}
          </EuiText>
        </>
      )}
      {issues.map((issue, index) => (
        <EuiText key={index} size="s" color={issue.severity === 'error' ? 'danger' : 'warning'}>
          {issue.message}
        </EuiText>
      ))}

      {onConfigChange && Object.keys(properties).length > 0 && (
        <>
          <EuiSpacer size="m" />
          <EuiTitle size="xxs">
            <h4>{t('configuration')}</h4>
          </EuiTitle>
          {Object.entries(properties).map(([name, property]) => (
            <ConfigField
              key={name}
              name={name}
              property={property}
              value={config?.[name]}
              onChange={(value) => onConfigChange({ ...config, [name]: value })}
            />
          ))}
        </>
      )}

      <EuiSpacer size="m" />
      <EuiDescriptionList
        compressed
        type="column"
        listItems={[
          {
            title: t('inputs'),
            description:
              step.inputs.length ?
                step.inputs.map((input) => (
                  <div key={input.name}>
                    <code>{input.name}</code>: {typeLabel(input.type)}
                    {!input.required && ` (${t('optional')})`}
                  </div>
                ))
              : t('none'),
          },
          {
            title: t('outputs'),
            description: (
              <>
                {guaranteedOutputs.length ?
                  guaranteedOutputs.map((output) => (
                    <div key={output.key}>
                      <code>{output.key}</code>: {typeLabel(output.type)}
                    </div>
                  ))
                : t('none')}
                {!step.outputs_known && <EuiText size="xs">{t('unknownOutputs')}</EuiText>}
              </>
            ),
          },
        ]}
      />
      <EuiSpacer size="s" />
      {step.writes_subscription && <EuiBadge color="warning">{t('writesSubscription')}</EuiBadge>}
      {step.used_in_workflows.length > 0 && (
        <EuiText size="xs" color="subdued">
          {t('usedIn', { workflows: step.used_in_workflows.join(', ') })}
        </EuiText>
      )}
    </EuiPanel>
  );
};
