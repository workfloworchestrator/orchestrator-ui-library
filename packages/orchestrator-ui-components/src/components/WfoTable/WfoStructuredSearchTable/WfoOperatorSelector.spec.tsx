/**
 * Reproduces the WfoFilterBuilder wiring around operator selection: a controlled
 * QueryBuilder with resetOnFieldChange=false, getOperators backed by a map that is
 * filled when a field is selected (like fieldToOperatorMap), and a value editor
 * that hides itself for the unary null/notNull operators.
 */
import React, { useState } from 'react';
import type { FieldSelectorProps, FullOperator, RuleGroupType, ValueEditorProps } from 'react-querybuilder';
import { QueryBuilder } from 'react-querybuilder';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { WfoOperatorSelector } from './WfoOperatorSelector';

const FIELD_OPERATORS: Record<string, FullOperator[]> = {
  componentField: [
    { name: 'notNull', label: '✓ has component', value: 'notNull', arity: 'unary' },
    { name: 'null', label: '✗ does not have component', value: 'null', arity: 'unary' },
  ],
  textField: [
    { name: '=', label: '= equals', value: '=' },
    { name: '!=', label: '≠ not equals', value: '!=' },
  ],
  // A field the autocomplete could not resolve: storeFieldOperators falls back to []
  unknownField: [],
  // A field whose operator list starts with the unary component operators
  mixedField: [
    { name: 'notNull', label: '✓ has component', value: 'notNull', arity: 'unary' },
    { name: 'null', label: '✗ does not have component', value: 'null', arity: 'unary' },
    { name: 'contains', label: '∋ contains', value: 'contains' },
  ],
};

const FieldSelectorStub = ({ handleOnChange, value, context }: FieldSelectorProps) => (
  <select
    data-testid="field-selector"
    value={value}
    onChange={(e) => {
      context.onFieldSelected(e.target.value);
      handleOnChange(e.target.value);
    }}
  >
    <option value="~">~</option>
    <option value="componentField">componentField</option>
    <option value="textField">textField</option>
    <option value="unknownField">unknownField</option>
    <option value="mixedField">mixedField</option>
  </select>
);

const ValueEditorStub = ({ operator }: ValueEditorProps) => {
  if (operator === 'null' || operator === 'notNull') {
    return null;
  }
  return <input data-testid="value-editor" />;
};

const initialRuleGroup: RuleGroupType = {
  id: 'root',
  rules: [{ id: 'rule-0', field: '~', operator: '=', value: '' }],
  combinator: 'and',
};

const Harness = ({ onQueryChange }: { onQueryChange?: (q: RuleGroupType) => void }) => {
  const [query, setQuery] = useState<RuleGroupType>(initialRuleGroup);
  const [fieldToOperatorMap, setFieldToOperatorMap] = useState<Map<string, FullOperator[]>>(new Map());

  return (
    <QueryBuilder
      query={query}
      enableMountQueryChange={false}
      onQueryChange={(q: RuleGroupType) => {
        setQuery(q);
        onQueryChange?.(q);
      }}
      context={{
        onFieldSelected: (field: string) => {
          setFieldToOperatorMap((previousMap) => new Map(previousMap).set(field, FIELD_OPERATORS[field] ?? []));
        },
      }}
      getOperators={(field) => fieldToOperatorMap.get(field) ?? []}
      controlElements={{
        fieldSelector: FieldSelectorStub,
        operatorSelector: WfoOperatorSelector,
        valueEditor: ValueEditorStub,
      }}
      resetOnFieldChange={false}
    />
  );
};

const selectField = (field: string) => {
  fireEvent.change(screen.getByTestId('field-selector'), { target: { value: field } });
};

// The operator selector is the only select inside the rule row besides the field-selector stub.
const getOperatorSelect = () =>
  screen
    .getAllByRole<HTMLSelectElement>('combobox')
    .find((select) => select.closest('.rule') && select.dataset.testid !== 'field-selector') as HTMLSelectElement;

describe('WfoOperatorSelector operator reset on field change', () => {
  it('resets to the first operator when the selected field does not support the current one', () => {
    render(<Harness />);

    selectField('componentField');
    expect(getOperatorSelect().value).toBe('notNull');
    expect(screen.queryByTestId('value-editor')).not.toBeInTheDocument();
  });

  it('recovers from a unary operator when switching to a field without unary operators', () => {
    render(<Harness />);

    selectField('componentField');
    expect(getOperatorSelect().value).toBe('notNull');

    selectField('textField');
    expect(getOperatorSelect().value).toBe('=');
    expect(screen.getByTestId('value-editor')).toBeInTheDocument();
  });

  it('recovers from a unary operator when switching to a field whose operators are unknown', () => {
    render(<Harness />);

    selectField('componentField');
    expect(getOperatorSelect().value).toBe('notNull');

    selectField('unknownField');
    expect(getOperatorSelect().value).not.toBe('notNull');
    expect(screen.getByTestId('value-editor')).toBeInTheDocument();
  });

  it('prefers a non-unary operator as the default when the current operator is invalid', () => {
    render(<Harness />);

    // The initial rule operator '=' is not in mixedField's list; the reset should skip
    // the leading unary operators so the value editor stays visible.
    selectField('mixedField');
    expect(getOperatorSelect().value).toBe('contains');
    expect(screen.getByTestId('value-editor')).toBeInTheDocument();
  });
});
