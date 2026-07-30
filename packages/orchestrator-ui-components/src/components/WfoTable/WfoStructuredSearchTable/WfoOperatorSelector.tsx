import React, { useEffect, useMemo, useRef } from 'react';
import type { FullOperator, OperatorSelectorProps, OptionGroup } from 'react-querybuilder';
import { defaultOperators } from 'react-querybuilder';

import { EuiSelect } from '@elastic/eui';

const isOptionGroup = (operator: FullOperator | OptionGroup<FullOperator>): operator is OptionGroup<FullOperator> =>
  'options' in operator;

// The search backend has no is-null operator: null/notNull only occur here as the
// react-querybuilder encoding of the component-presence operators, so a restored rule
// should label them accordingly instead of using defaultOperators' "is (not) null".
const FALLBACK_OPERATOR_LABELS: Record<string, string> = {
  notNull: '✓ has component',
  null: '✗ does not have component',
};

// null/notNull hide the value editor, so they only make a sane default when a field
// offers nothing else; prefer the first operator that keeps the value editor visible.
const getDefaultOperator = (options: FullOperator[]) =>
  (options.find((option) => option.arity !== 'unary') ?? options[0]).name;

export const WfoOperatorSelector = (props: OperatorSelectorProps) => {
  const { value, handleOnChange } = props;

  const flatOptions = useMemo(
    () =>
      (props.options as Array<FullOperator | OptionGroup<FullOperator>>).flatMap((option) =>
        isOptionGroup(option) ? option.options : [option],
      ),
    [props.options],
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
    if (!optionsChanged) return;

    if (flatOptions.length === 0) {
      // The new field's operators are unknown (nothing stored for it). A left-over unary
      // operator would keep the value editor hidden with nothing in the dropdown to bring
      // it back, so fall back to the query builder's default operator.
      if (value === 'null' || value === 'notNull') {
        handleOnChange('=');
      }
      return;
    }

    const currentValueIsValid = selectOptions.some((option) => option.value === value);
    if (!currentValueIsValid) {
      handleOnChange(getDefaultOperator(flatOptions));
    }
  }, [optionsKey, flatOptions, selectOptions, value, handleOnChange]);

  // A restored operator that falls outside the field's list must still be visible in
  // the dropdown; without it EuiSelect renders an empty selection for the rule.
  const currentValueIsListed = !value || selectOptions.some((option) => option.value === value);
  const displayOptions =
    currentValueIsListed ? selectOptions : (
      [
        ...selectOptions,
        {
          value,
          text:
            FALLBACK_OPERATOR_LABELS[value]
            ?? defaultOperators.find((operator) => operator.name === value)?.label
            ?? value,
        },
      ]
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
