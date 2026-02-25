import React from 'react';

import {
  PydanticFormElementProps,
  RenderFields,
  disableField,
  getPydanticFormComponents,
  useGetConfig,
} from 'pydantic-forms';

import { EuiFlexGroup } from '@elastic/eui';

import { getWfoObjectFieldStyles } from './styles';

export const WfoObjectField = ({ pydanticFormField }: PydanticFormElementProps) => {
  const config = useGetConfig();
  const disabled = pydanticFormField.attributes?.disabled || false;
  const { wfoObjectFieldStyles } = getWfoObjectFieldStyles();
  const components = getPydanticFormComponents(pydanticFormField.properties || {}, config?.componentMatcherExtender);

  // We have decided - for now - on the convention that all descendants of disabled fields will be disabled as well
  // so we will not displaying any interactive elements inside a disabled element
  if (disabled) {
    components.forEach((component) => {
      component.pydanticFormField = disableField(component.pydanticFormField);
    });
  }
  return (
    <EuiFlexGroup data-testid={pydanticFormField.id} css={wfoObjectFieldStyles}>
      <RenderFields pydanticFormComponents={components} idPrefix={pydanticFormField.id} />
    </EuiFlexGroup>
  );
};
