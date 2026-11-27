import React from 'react';

import { act, render } from '@testing-library/react';

import { WfoGrid } from './WfoGrid';

const tiles = ['alpha', 'beta', 'gamma', 'delta'].map((tileName) => <div key={tileName} data-tile={tileName} />);

describe('WfoGrid', () => {
  it('renders the items directly in the grid by default', () => {
    const { container } = render(<WfoGrid maxColumns={2}>{tiles}</WfoGrid>);

    expect(container.firstElementChild?.children).toHaveLength(4);
    expect(container.firstElementChild).toHaveStyle({ '--wfo-grid-max-columns': '2' });
  });

  it.each(['rows', 'masonry'] as const)('sets the gap from a space token in the %s layout', (layout) => {
    const { container } = render(
      <WfoGrid layout={layout} gap={100}>
        {tiles}
      </WfoGrid>,
    );

    expect(container.firstElementChild).toHaveStyle({ '--wfo-grid-gap': 'var(--wfo-space-100)' });
  });

  it('keeps the items in their own order and puts item n in column n % columns', () => {
    const { container } = render(
      <WfoGrid layout="masonry" maxColumns={3}>
        {tiles}
      </WfoGrid>,
    );
    const gridItems = [...(container.firstElementChild?.children ?? [])] as HTMLElement[];

    expect(gridItems.map((gridItem) => gridItem.querySelector('[data-tile]')?.getAttribute('data-tile'))).toEqual([
      'alpha',
      'beta',
      'gamma',
      'delta',
    ]);
    expect(gridItems.map((gridItem) => gridItem.style.gridColumn)).toEqual(['1', '2', '3', '1']);
  });

  describe('with measured sizes', () => {
    const tileHeights: Record<string, number> = { alpha: 100, beta: 40, gamma: 40, delta: 40 };
    let triggerResize: () => void = () => undefined;

    beforeEach(() => {
      global.ResizeObserver = class {
        constructor(callback: () => void) {
          triggerResize = callback;
        }
        observe() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver;
      jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
        const tileName = this.querySelector('[data-tile]')?.getAttribute('data-tile') ?? '';
        return { height: tileHeights[tileName] ?? 0 } as DOMRect;
      });
      jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    });

    afterEach(() => {
      jest.restoreAllMocks();
      delete (global as { ResizeObserver?: unknown }).ResizeObserver;
    });

    it('starts each item right below the item above it in its column', () => {
      const { container } = render(
        <WfoGrid layout="masonry" maxColumns={3}>
          {tiles}
        </WfoGrid>,
      );
      const gridItems = [...(container.firstElementChild?.children ?? [])] as HTMLElement[];

      // Rows of 1px. jsdom has no CSS, so the gap is 0 here.
      expect(gridItems.map((gridItem) => gridItem.style.gridRow)).toEqual([
        '1 / span 100',
        '1 / span 40',
        '1 / span 40',
        '101 / span 40',
      ]);
    });

    it('fits as many columns as the width allows, up to maxColumns', () => {
      jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(700);
      const { container } = render(
        <WfoGrid layout="masonry" maxColumns={3}>
          {tiles}
        </WfoGrid>,
      );
      act(() => triggerResize());

      // 700px fits two columns of the 320px fallback minimum.
      expect(container.firstElementChild).toHaveStyle({ '--wfo-grid-column-count': '2' });
    });
  });
});
