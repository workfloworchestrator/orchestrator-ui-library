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
import { collectRuleFields } from './utils';

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
  // A string field: equals is listed first, but contains should be the default
  stringField: [
    { name: '=', label: '= equals', value: '=' },
    { name: '!=', label: '≠ not equals', value: '!=' },
    { name: 'contains', label: '∋ contains', value: 'contains' },
    { name: 'doesNotContain', label: '∌ does not contain', value: 'doesNotContain' },
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
    <option value="stringField">stringField</option>
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
  rules: [{ id: 'rule-0', field: '~', operator: 'contains', value: '' }],
  combinator: 'and',
};

const Harness = ({
  onQueryChange,
  initialQuery = initialRuleGroup,
}: {
  onQueryChange?: (q: RuleGroupType) => void;
  initialQuery?: RuleGroupType;
}) => {
  const [query, setQuery] = useState<RuleGroupType>(initialQuery);
  const [fieldToOperatorMap, setFieldToOperatorMap] = useState<Map<string, FullOperator[]>>(new Map());

  return (
    <>
      {/* Mirrors WfoFilterBuilder resolving the operators of fields restored from CEL: the
          operator list is filled in without the rule's field changing. */}
      <button
        onClick={() =>
          setFieldToOperatorMap((previousMap) => {
            const resolvedMap = new Map(previousMap);
            collectRuleFields(query).forEach((field) => resolvedMap.set(field, FIELD_OPERATORS[field] ?? []));
            return resolvedMap;
          })
        }
      >
        resolve operators
      </button>
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
    </>
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

    // '=' is not in mixedField's list; the reset should skip the leading unary operators
    // so the value editor stays visible.
    selectField('textField');
    selectField('mixedField');
    expect(getOperatorSelect().value).toBe('contains');
    expect(screen.getByTestId('value-editor')).toBeInTheDocument();
  });
});

describe('WfoOperatorSelector default operator', () => {
  it('keeps contains for a picked field that offers it', () => {
    render(<Harness />);

    selectField('stringField');
    expect(getOperatorSelect().value).toBe('contains');
  });

  it('falls back to the first operator for a picked field that does not offer contains', () => {
    render(<Harness />);

    selectField('textField');
    expect(getOperatorSelect().value).toBe('=');
  });

  it('defaults to contains when the current operator is invalid for a field that offers it', () => {
    render(<Harness />);

    // notNull is not in stringField's list, so the rule resets to the preferred default.
    selectField('componentField');
    selectField('stringField');
    expect(getOperatorSelect().value).toBe('contains');
  });

  it('keeps an operator the user chose while the field stays the same', () => {
    render(<Harness />);

    selectField('stringField');
    fireEvent.change(getOperatorSelect(), { target: { value: '=' } });
    expect(getOperatorSelect().value).toBe('=');
  });

  it('does not rewrite the operator of a restored rule when its operators resolve', () => {
    // A rule restored from CEL (URL or textarea): its field is set from the start and its
    // operator list is filled in afterwards, without the field changing.
    const restoredQuery: RuleGroupType = {
      id: 'root',
      rules: [{ id: 'rule-0', field: 'stringField', operator: '=', value: 'node' }],
      combinator: 'and',
    };
    render(<Harness initialQuery={restoredQuery} />);

    fireEvent.click(screen.getByText('resolve operators'));
    expect(getOperatorSelect().value).toBe('=');
  });
});
