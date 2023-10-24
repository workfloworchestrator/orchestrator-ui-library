import React, { FC } from 'react';

import { WfoTreeBranch } from './WfoTreeBranch';
import { TreeBlock } from '../../types';

type WfoTreeProps = {
    data: TreeBlock[];
};

export const WfoTree: FC<WfoTreeProps> = ({ data }) => (
    <div style={{ width: '500px' }}>
        {data.map((item) => (
            <WfoTreeBranch key={item.id} item={item} level={0} />
        ))}
    </div>
);
