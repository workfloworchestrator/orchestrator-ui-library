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
    // Reset to the first option when the operator is unset OR when the current operator
    // is no longer valid for the selected field. resetOnFieldChange=false on QueryBuilder
    // preserves the operator across field changes, so the stale-value branch is what keeps
    // the dropdown coherent when the new field's operator list doesn't include it.
    if (selectOptions.length === 0) return;
    const currentValueIsValid = selectOptions.some((option) => option.value === props.value);
    if (!currentValueIsValid) {
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
