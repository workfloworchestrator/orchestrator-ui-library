import React from 'react';
import { useWatch } from 'react-hook-form';

import { PydanticFormElement, useGetForm } from 'pydantic-forms';

import { euiFontSizeFromScale } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

export const WfoLabel: PydanticFormElement = ({ pydanticFormField }) => {
  const { theme } = useOrchestratorTheme();
  const { control } = useGetForm();
  const formValue = useWatch({ control, name: pydanticFormField.id });
  const labelText =
    typeof formValue === 'string' && formValue ? formValue : pydanticFormField.default || pydanticFormField.title;

  return (
    <div data-testid={pydanticFormField.id}>
      <label
        css={{
          fontSize: euiFontSizeFromScale('m', theme),
          fontWeight: theme.font.weight.semiBold,
          color: theme.colors.link,
          display: 'block',
        }}
        id={pydanticFormField.id}
      >
        {labelText}
      </label>
    </div>
  );
};
