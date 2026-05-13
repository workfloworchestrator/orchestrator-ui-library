import React, { useEffect, useMemo } from 'react';
import type { FullOperator, OperatorSelectorProps, OptionGroup } from 'react-querybuilder';

import { EuiSelect } from '@elastic/eui';

const isOptionGroup = (operator: FullOperator | OptionGroup<FullOperator>): operator is OptionGroup<FullOperator> =>
  'options' in operator;

export const WfoOperatorSelector = (props: OperatorSelectorProps) => {
  const flatOptions = (props.options as Array<FullOperator | OptionGroup<FullOperator>>).flatMap((option) =>
    isOptionGroup(option) ? option.options : [option],
  );
  const selectOptions = useMemo(
    () => flatOptions.map((option) => ({ value: option.name, text: option.label })),
    [flatOptions],
  );

  useEffect(() => {
    if (props.options && !props.value && selectOptions.length > 0) {
      props.handleOnChange(selectOptions[0].value);
    }
  }, [props, props.options, props.value, selectOptions]);

  return (
    <EuiSelect
      options={selectOptions}
      value={props.value}
      onChange={(e) => props.handleOnChange(e.target.value)}
      disabled={props.disabled}
    />
  );
};
