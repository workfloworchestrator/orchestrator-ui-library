/**
 * The expanded ("match details") row under each data row hides itself with display: none and
 * is revealed by sibling selectors that WfoTable puts on the data row: always when
 * showExpandedRows is set, and on hover/focus otherwise. These tests pin the whole mechanism
 * down at the DOM level: the detail row must be the data row's next sibling, the reveal rules
 * must be emitted, and their selectors must actually match the detail row.
 */
import React from 'react';

import { css } from '@emotion/react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { ColumnType, WfoTable, WfoTableColumnConfig } from './WfoTable';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

type Item = { id: string; name: string };

const data: Item[] = [
  { id: 'row-1', name: 'First row' },
  { id: 'row-2', name: 'Second row' },
];

const columnConfig: WfoTableColumnConfig<Item> = {
  name: {
    columnType: ColumnType.DATA,
    label: 'Name',
  },
};

// Mimics WfoExpandingSearchRow: a <tr> that hides itself
const hideStyle = css({ display: 'none' });
const DetailRow = ({ text }: { text: string }) => (
  <tr css={hideStyle}>
    <td>{text}</td>
  </tr>
);

const rowExpandingConfiguration = {
  uniqueRowId: 'id' as keyof WfoTableColumnConfig<Item>,
  uniqueRowIdToExpandedRowMap: {
    'row-1': <DetailRow text="detail-1" />,
    'row-2': <DetailRow text="detail-2" />,
  },
};

// Emotion may insert rules through the CSSOM, leaving <style> tags without text content, so
// read the rules from document.styleSheets. Returns [selectorText, display] pairs, with the
// selector whitespace stripped since the CSSOM normalizes it.
const getDisplayRules = () =>
  Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .filter((rule): rule is CSSStyleRule => 'selectorText' in rule)
    .map((rule): [string, string] => [rule.selectorText.replace(/\s+/g, ''), rule.style.display])
    .filter(([, display]) => Boolean(display));

const getRowPair = () => {
  const dataRow = screen.getByText('First row').closest('tr');
  const detailRow = dataRow?.nextElementSibling;
  return { dataRow, detailRow };
};

// The reveal selectors resolve '&' to the emotion class composed on the data row
const getDataRowEmotionClass = (dataRow: HTMLTableRowElement) => {
  const emotionClass = Array.from(dataRow.classList).find((className) => className.startsWith('css-'));
  expect(emotionClass).toBeDefined();
  return emotionClass;
};

describe('WfoTable expanded row reveal', () => {
  it('renders the detail row as next sibling of its data row, hidden by its own style', () => {
    render(
      <WfoTable<Item> data={data} columnConfig={columnConfig} rowExpandingConfiguration={rowExpandingConfiguration} />,
    );

    const { dataRow, detailRow } = getRowPair();
    expect(dataRow).toBeInTheDocument();
    expect(detailRow).toHaveTextContent('detail-1');

    const detailRowClass = Array.from(detailRow!.classList).find((className) => className.startsWith('css-'));
    expect(getDisplayRules()).toContainEqual([`.${detailRowClass}`, 'none']);
  });

  it('reveals every detail row through the sibling selector when showExpandedRows is set', () => {
    render(
      <WfoTable<Item>
        data={data}
        columnConfig={columnConfig}
        rowExpandingConfiguration={rowExpandingConfiguration}
        showExpandedRows
      />,
    );

    const { dataRow, detailRow } = getRowPair();
    const emotionClass = getDataRowEmotionClass(dataRow!);

    expect(getDisplayRules()).toContainEqual([`.${emotionClass}+tr`, 'table-row']);
    expect(detailRow!.matches(`.${emotionClass} + tr`)).toBe(true);
  });

  it('reveals a detail row on hover/focus of the data row or of the detail row itself when showExpandedRows is not set', () => {
    render(
      <WfoTable<Item> data={data} columnConfig={columnConfig} rowExpandingConfiguration={rowExpandingConfiguration} />,
    );

    const { dataRow, detailRow } = getRowPair();
    const emotionClass = getDataRowEmotionClass(dataRow!);
    const displayRules = getDisplayRules();

    expect(displayRules).toContainEqual([`.${emotionClass}:hover+tr,.${emotionClass}:focus-within+tr`, 'table-row']);
    // The rule that keeps the row open while hovering the revealed row itself (flicker fix)
    expect(displayRules).toContainEqual([`.${emotionClass}+tr:hover,.${emotionClass}+tr:focus-within`, 'table-row']);

    // :hover cannot be simulated in jsdom; verify the selectors structurally instead
    expect(detailRow!.matches(`.${emotionClass} + tr`)).toBe(true);
  });
});
