import React from 'react';

import _ from 'lodash';
import type { PydanticFormControlledElement } from 'pydantic-forms';
import { getFormFieldIdWithPath } from 'pydantic-forms';

import { EuiFieldText } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';

export const WfoText: PydanticFormControlledElement = ({ onChange, value, disabled, pydanticFormField }) => {
  const { formFieldBaseStyle } = useWithOrchestratorTheme(getFormFieldsBaseStyle);
  // If the field is part of an array the value is passed in as an object with the field name as key
  // this is imposed by react-hook-form. We try to detect this and extract the actual value
  const fieldName = getFormFieldIdWithPath(pydanticFormField.id);
  const fieldValue = _.isObject(value) && _.has(value, fieldName) ? _.get(value, fieldName) : value;
  return (
    <EuiFieldText
      data-testid={pydanticFormField.id}
      css={formFieldBaseStyle}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      value={fieldValue}
      fullWidth
    />
  );
};
