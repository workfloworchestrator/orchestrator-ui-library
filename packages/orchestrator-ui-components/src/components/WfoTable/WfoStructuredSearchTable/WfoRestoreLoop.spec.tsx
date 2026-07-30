/**
 * Regression test for the URL-restore render loop: a controlled QueryBuilder wired like
 * WfoSearchPocPage + WfoFilterBuilder, restoring `lldp == true` from CEL while the path
 * info of `lldp` resolves asynchronously (boolean ui type + operator list).
 *
 * The rule group is deliberately created with parseCEL directly — without the rule ids
 * parseCelToRuleGroup adds — so every query prop change remounts the rules. The editors
 * must not dispatch a query change on mount for a value the rule already holds, or the
 * remount + mount-commit combination feeds back into an endless update cycle.
 */
import React, { useEffect, useState } from 'react';
import type { FieldSelectorProps, FullOperator, RuleGroupType } from 'react-querybuilder';
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import { parseCEL } from 'react-querybuilder/parseCEL';

import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';

import type { PathInfo } from '@/types';

import { WfoOperatorSelector } from './WfoOperatorSelector';
import { WfoValueEditor } from './WfoValueEditor';

jest.mock('@/hooks', () => ({
  useWithOrchestratorTheme: () => ({}),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const LLDP_PATH_INFO = {
  path: 'lldp',
  type: 'boolean',
  operators: ['eq', 'neq'],
  value_schema: {},
  group: 'leaf',
  ui_types: ['boolean'],
} as unknown as PathInfo;

const SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP: Record<string, string> = {
  eq: '=',
  neq: '!=',
};

const mapOperators = (operators?: string[]): FullOperator[] =>
  (operators ?? []).map((operator) => {
    const rqbOperator = SEARCH_OPERATOR_TO_RQB_OPERATOR_MAP[operator] ?? operator;
    return { name: rqbOperator, label: rqbOperator, value: rqbOperator };
  });

const FieldSelectorStub = ({ value }: FieldSelectorProps) => <span data-testid="field">{value}</span>;

// Circuit breaker: records query updates and stops propagating them after a threshold
// so a render loop terminates and can be inspected instead of hanging the test.
const queryChangeLog: string[] = [];

const Harness = () => {
  // Page-like state: rule group parsed from the URL's CEL string (rules have no ids).
  const [query, setQuery] = useState<RuleGroupType>(() => parseCEL('lldp == true'));
  const [, setFilterString] = useState<string>('lldp == true');

  // WfoFilterBuilder-like state, with the async field resolution simulated: the maps
  // are empty on mount and get lldp's path info after a tick.
  const [fieldToOperatorMap, setFieldToOperatorMap] = useState<Map<string, string[]>>(new Map());
  const [fieldPathInfoMap, setFieldPathInfoMap] = useState<Map<string, PathInfo>>(new Map());

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFieldToOperatorMap(new Map([['lldp', LLDP_PATH_INFO.operators]]));
      setFieldPathInfoMap(new Map([['lldp', LLDP_PATH_INFO]]));
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <QueryBuilder
      query={query}
      enableMountQueryChange={false}
      onQueryChange={(ruleGroup: RuleGroupType) => {
        queryChangeLog.push(JSON.stringify(ruleGroup));
        if (queryChangeLog.length > 20) return;
        // Mirrors WfoSearchPocPage.onUpdateQueryBuilder
        setQuery({ ...ruleGroup });
        setFilterString(formatQuery({ ...ruleGroup }, { format: 'cel', fallbackExpression: '' }));
      }}
      context={{
        fieldPathInfoMap,
        onFieldSelected: () => {},
      }}
      getOperators={(field) => mapOperators(fieldToOperatorMap.get(field))}
      controlElements={{
        fieldSelector: FieldSelectorStub,
        operatorSelector: WfoOperatorSelector,
        valueEditor: WfoValueEditor,
      }}
      resetOnFieldChange={false}
    />
  );
};

describe('URL restore with async path info resolution', () => {
  it('settles without a render loop once the path info resolves', async () => {
    render(<Harness />);

    // Flush the simulated resolution plus any follow-up effect cascades.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(screen.getByTestId('field')).toHaveTextContent('lldp');
    // The resolved boolean ui type must render the boolean editor for the restored rule
    expect(screen.getByRole('button', { name: 'True' })).toBeInTheDocument();
    // Nothing about the restored rule changed, so no query updates should have fired
    expect(queryChangeLog).toEqual([]);
  });
});
