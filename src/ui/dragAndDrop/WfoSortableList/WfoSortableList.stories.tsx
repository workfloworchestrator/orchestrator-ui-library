import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WfoGrid } from '../../layout/WfoGrid';
import { WfoPanel } from '../../layout/WfoPanel';
import type { WfoSortableItemProps } from '../WfoSortableItem';
import { WfoSortableItem } from '../WfoSortableItem';
import { WfoSortableList } from './WfoSortableList';

type SortableExampleArgs = { maxColumns: number; handlePlacement: WfoSortableItemProps['handlePlacement'] };

const meta: Meta<SortableExampleArgs> = {
  title: 'Design system/SortableList',
  args: { handlePlacement: 'inline' },
  render: (args) => SortableListStory(args),
  argTypes: {
    handlePlacement: { control: 'inline-radio', options: ['inline', 'edge'] },
    maxColumns: { control: false },
  },
};
export default meta;

type Story = StoryObj<SortableExampleArgs>;

const initialTileNames = ['Chassis', 'Services', 'Customers', 'Fibers', 'Ports', 'Links'];

/** The sortable parts add no layout. Put any layout between the list and the items. */
// Called as a function, not as <SortableListStory />, so the Docs code shows the real parts.
const SortableListStory = ({ maxColumns, handlePlacement }: SortableExampleArgs) => {
  const [tileNames, setTileNames] = useState(initialTileNames);
  return (
    <WfoSortableList
      itemIds={tileNames}
      onReorder={setTileNames}
      renderOverlay={(activeTileName) => <WfoPanel>{activeTileName}</WfoPanel>}
      instructions="Press space to pick up a tile, use the arrow keys to move it and press space to drop it."
    >
      <WfoGrid maxColumns={maxColumns}>
        {tileNames.map((tileName) => (
          <WfoSortableItem
            key={tileName}
            id={tileName}
            handleLabel={`Reorder ${tileName}`}
            handlePlacement={handlePlacement}
          >
            <WfoPanel>{tileName}</WfoPanel>
          </WfoSortableItem>
        ))}
      </WfoGrid>
    </WfoSortableList>
  );
};

export const List: Story = { args: { maxColumns: 1 } };
/** The same parts in a 3-column `WfoGrid`. */
export const Grid: Story = { args: { maxColumns: 3 } };
