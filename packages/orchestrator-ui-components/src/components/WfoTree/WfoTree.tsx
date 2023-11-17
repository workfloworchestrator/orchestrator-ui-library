import React, { FC, useEffect } from 'react';

import { WfoTreeBranch } from './WfoTreeBranch';
import { TreeContext, TreeContextType } from '../../contexts';
import { TreeBlock } from '../../types';

type WfoTreeProps = {
    data: TreeBlock[];
    depthList: number[];
};

export const WfoTree: FC<WfoTreeProps> = ({ data, depthList }) => {
    const { setDepths } = React.useContext(TreeContext) as TreeContextType;

    useEffect(() => {
        setDepths(depthList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setDepths, TreeContext]);

    return (
        <div style={{ width: '500px' }}>
            {data.map((item) => (
                <WfoTreeBranch key={item.id} item={item} level={0} />
            ))}
        </div>
    );
};
