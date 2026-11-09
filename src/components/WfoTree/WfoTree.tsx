import React, { FC, useEffect } from 'react';

import { TreeContext, TreeContextType } from '@/contexts';
import { TreeBlock } from '@/types';

import { WfoTreeBranch } from './WfoTreeBranch';

type WfoTreeProps = {
  treeBlocks: TreeBlock[];
  depthList: number[];
};

export const WfoTree: FC<WfoTreeProps> = ({ treeBlocks, depthList }) => {
  const { setDepths } = React.useContext(TreeContext) as TreeContextType;

  useEffect(() => {
    setDepths(depthList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDepths, TreeContext]);

  return (
    <div style={{ width: '500px' }}>
      {treeBlocks.map((item) => (
        <WfoTreeBranch key={item.id} item={item} level={0} />
      ))}
    </div>
  );
};
