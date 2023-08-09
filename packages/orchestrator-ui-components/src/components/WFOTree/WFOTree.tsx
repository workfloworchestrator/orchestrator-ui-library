import React, { FC } from 'react';

import { WFOTreeBranch } from './WFOTreeBranch';
import { TreeBlock } from '../../types';

type WFOTreeProps = {
    data: TreeBlock[];
};

export const WFOTree: FC<WFOTreeProps> = ({ data }) => (
    <div style={{ width: '500px' }}>
        {data.map((item) => (
            <WFOTreeBranch key={item.id} item={item} level={0} />
        ))}
    </div>
);
