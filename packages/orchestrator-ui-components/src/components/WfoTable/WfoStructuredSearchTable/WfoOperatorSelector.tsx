import React from 'react';
import type { OperatorSelectorProps } from 'react-querybuilder';

import { EuiSelect, EuiSelectOption } from '@elastic/eui';

export const WfoOperatorSelector = (props: OperatorSelectorProps) => {
  console.log(props);
  const options: EuiSelectOption[] = ['+', '-'].map((operator) => ({ text: operator, value: operator }));
  return <EuiSelect options={options} />;
};
