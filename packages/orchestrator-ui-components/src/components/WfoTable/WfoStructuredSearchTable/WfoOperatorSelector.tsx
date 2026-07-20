import React, { useEffect, useMemo, useRef } from 'react';
import type { FullOperator, OperatorSelectorProps, OptionGroup } from 'react-querybuilder';
import { defaultOperators } from 'react-querybuilder';

import { EuiSelect } from '@elastic/eui';

const isOptionGroup = (operator: FullOperator | OptionGroup<FullOperator>): operator is OptionGroup<FullOperator> =>
  'options' in operator;

export const WfoOperatorSelector = (props: OperatorSelectorProps) => {
  const { value, handleOnChange } = props;

  const flatOptions = (props.options as Array<FullOperator | OptionGroup<FullOperator>>).flatMap((option) =>
    isOptionGroup(option) ? option.options : [option],
  );

  const selectOptions = useMemo(
    () => flatOptions.map((option) => ({ value: option.name, text: option.label })),
    [flatOptions],
  );

  const optionsKey = selectOptions.map((option) => option.value).join('|');
  const previousOptionsKeyRef = useRef(optionsKey);

  useEffect(() => {
    const optionsChanged = previousOptionsKeyRef.current !== optionsKey;
    previousOptionsKeyRef.current = optionsKey;

    // Reset to the first option only when the field's operator list changes — i.e. the
    // user picked a (different) field, and resetOnFieldChange=false on QueryBuilder
    // preserved an operator that is not valid for it. The `optionsChanged` guard keeps
    // rules restored from CEL (URL or textarea) intact on mount: parseCEL can produce
    // operators outside the prefilled operator lists (e.g. beginsWith), and resetting
    // those here would silently rewrite the user's filter string.
    if (!optionsChanged || selectOptions.length === 0) return;
    const currentValueIsValid = selectOptions.some((option) => option.value === value);
    if (!currentValueIsValid) {
      handleOnChange(selectOptions[0].value);
    }
  }, [optionsKey, selectOptions, value, handleOnChange]);

  // A restored operator that falls outside the field's list must still be visible in
  // the dropdown; without it EuiSelect renders an empty selection for the rule.
  const currentValueIsListed = !value || selectOptions.some((option) => option.value === value);
  const displayOptions =
    currentValueIsListed ? selectOptions : (
      [...selectOptions, { value, text: defaultOperators.find((operator) => operator.name === value)?.label ?? value }]
    );

  return (
    <EuiSelect
      options={displayOptions}
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
      disabled={props.disabled}
    />
  );
};
