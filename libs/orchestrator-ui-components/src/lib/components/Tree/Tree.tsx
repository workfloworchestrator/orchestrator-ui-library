import React, { FC } from 'react';

import { TreeBranch } from './TreeBranch';
import { TreeBlock } from '../../types';

type TreeProps = {
    data: TreeBlock[];
};

export const Tree: FC<TreeProps> = ({ data }) => (
    <div style={{ width: '500px' }}>
        {data.map((item) => (
            <TreeBranch key={item.id} item={item} level={0} />
        ))}
    </div>
);
