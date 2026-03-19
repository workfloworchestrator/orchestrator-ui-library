import React from 'react';
import type { FullOperator, OperatorSelectorProps, OptionGroup } from 'react-querybuilder';

import { EuiSelect } from '@elastic/eui';

const isOptionGroup = (operator: FullOperator | OptionGroup<FullOperator>): operator is OptionGroup<FullOperator> =>
  'options' in operator;

export const WfoOperatorSelector = (props: OperatorSelectorProps) => {
  const flatOptions = (props.options as Array<FullOperator | OptionGroup<FullOperator>>).flatMap((option) =>
    isOptionGroup(option) ? option.options : [option],
  );
  const selectOptions = flatOptions.map((option) => ({ value: option.name, text: option.label }));
  return (
    <EuiSelect
      options={selectOptions}
      value={props.value}
      onChange={(e) => props.handleOnChange(e.target.value)}
      disabled={props.disabled}
    />
  );
};
