import React from 'react';

import { PydanticFormElement } from 'pydantic-forms';

import { euiFontSizeFromScale } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

export const WfoLabel: PydanticFormElement = ({ pydanticFormField }) => {
  const { theme } = useOrchestratorTheme();

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
        {pydanticFormField.default || pydanticFormField.title}
      </label>
    </div>
  );
};
