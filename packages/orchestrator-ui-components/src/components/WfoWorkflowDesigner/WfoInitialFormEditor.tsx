import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiButton,
  EuiButtonIcon,
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiPanel,
  EuiSelect,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import { WorkflowDesignerFieldOptions, WorkflowDesignerFieldType, WorkflowDesignerFormField } from '@/types';

import { DEFAULT_FORM_FIELD } from './utils';

const SUBSCRIPTION_STATUSES = ['initial', 'active', 'migrating', 'disabled', 'terminated', 'provisioning'];

export type WfoInitialFormEditorProps = {
  fields: WorkflowDesignerFormField[];
  fieldTypes: WorkflowDesignerFieldType[];
  onChange: (fields: WorkflowDesignerFormField[]) => void;
};

const ListOption: FC<{
  label: string;
  values: string[];
  suggestions?: string[];
  onChange: (values: string[]) => void;
}> = ({ label, values, suggestions = [], onChange }) => (
  <EuiFormRow label={label} fullWidth display="rowCompressed">
    <EuiComboBox
      compressed
      fullWidth
      noSuggestions={!suggestions.length}
      options={suggestions.map((value) => ({ label: value }))}
      selectedOptions={values.map((value) => ({ label: value }))}
      onCreateOption={(value) => onChange([...values, value.trim()])}
      onChange={(selected) => onChange(selected.map((option) => option.label))}
    />
  </EuiFormRow>
);

export const WfoInitialFormEditor: FC<WfoInitialFormEditorProps> = ({ fields, fieldTypes, onChange }) => {
  const t = useTranslations('workflowDesigner.form');

  const update = (index: number, change: Partial<WorkflowDesignerFormField>) =>
    onChange(fields.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...change } : field)));
  const updateOptions = (index: number, change: Partial<WorkflowDesignerFieldOptions>) =>
    update(index, { options: { ...fields[index].options, ...change } });

  return (
    <EuiPanel hasBorder paddingSize="m">
      <EuiTitle size="xs">
        <h3>{t('title')}</h3>
      </EuiTitle>
      <EuiText size="xs" color="subdued">
        {t('help')}
      </EuiText>
      <EuiSpacer size="m" />
      {fields.map((field, index) => {
        const fieldType = fieldTypes.find((type) => type.key === field.type);
        return (
          <React.Fragment key={index}>
            <EuiPanel paddingSize="s" color="subdued" hasShadow={false}>
              <EuiFlexGroup gutterSize="s" responsive={false}>
                <EuiFlexItem>
                  <EuiFormRow label={t('name')} display="rowCompressed">
                    <EuiFieldText
                      compressed
                      value={field.name}
                      onChange={(event) => update(index, { name: event.target.value })}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label={t('type')} display="rowCompressed">
                    <EuiSelect
                      compressed
                      value={field.type}
                      options={fieldTypes.map((type) => ({ value: type.key, text: type.label }))}
                      onChange={(event) => update(index, { type: event.target.value })}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonIcon
                    iconType="trash"
                    color="danger"
                    aria-label={t('remove')}
                    css={{ marginTop: 22 }}
                    onClick={() => onChange(fields.filter((_, fieldIndex) => fieldIndex !== index))}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFormRow label={t('label')} fullWidth display="rowCompressed">
                <EuiFieldText
                  compressed
                  fullWidth
                  value={field.title}
                  onChange={(event) => update(index, { title: event.target.value })}
                />
              </EuiFormRow>
              <EuiSpacer size="xs" />
              <EuiSwitch
                compressed
                label={t('required')}
                checked={field.required}
                onChange={(event) => update(index, { required: event.target.checked })}
              />
              {fieldType?.options.includes('choices') && (
                <ListOption
                  label={t('choices')}
                  values={field.options.choices}
                  onChange={(choices) => updateOptions(index, { choices })}
                />
              )}
              {fieldType?.options.includes('product_tags') && (
                <ListOption
                  label={t('productTags')}
                  values={field.options.product_tags}
                  onChange={(product_tags) => updateOptions(index, { product_tags })}
                />
              )}
              {fieldType?.options.includes('statuses') && (
                <ListOption
                  label={t('statuses')}
                  values={field.options.statuses}
                  suggestions={SUBSCRIPTION_STATUSES}
                  onChange={(statuses) => updateOptions(index, { statuses })}
                />
              )}
            </EuiPanel>
            <EuiSpacer size="s" />
          </React.Fragment>
        );
      })}
      <EuiButton size="s" iconType="plusInCircle" onClick={() => onChange([...fields, { ...DEFAULT_FORM_FIELD }])}>
        {t('addField')}
      </EuiButton>
    </EuiPanel>
  );
};
