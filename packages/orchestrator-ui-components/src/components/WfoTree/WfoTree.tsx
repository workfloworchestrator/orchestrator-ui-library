import React, { FC, useEffect } from 'react';

import { WfoTreeBranch } from './WfoTreeBranch';
import { TreeBlock } from '../../types';
import { TreeContext, TreeContextType } from '../../contexts';

type WfoTreeProps = {
    data: TreeBlock[];
    depthList: number[];
};

export const WfoTree: FC<WfoTreeProps> = ({ data, depthList }) => {
    const { setDepths } = React.useContext(TreeContext) as TreeContextType;

    // setDepths(depthList)
    useEffect(() => {
        setDepths(depthList);
    }, [setDepths, TreeContext]);

    return (
        <div style={{ width: '500px' }}>
            {data.map((item) => (
                <WfoTreeBranch key={item.id} item={item} level={0} />
            ))}
        </div>
    );
};
