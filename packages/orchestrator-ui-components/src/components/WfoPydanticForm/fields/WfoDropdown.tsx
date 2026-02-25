import React from 'react';

import type { PydanticFormControlledElement } from 'pydantic-forms';

import { WfoReactSelect } from './WfoReactSelect';

export const WfoDropdown: PydanticFormControlledElement = ({ onChange, pydanticFormField, value }) => {
  const dropDownOptions = pydanticFormField.options?.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return <WfoReactSelect options={dropDownOptions || []} onChange={onChange} id={pydanticFormField.id} value={value} />;
};
