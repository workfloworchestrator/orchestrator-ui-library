import React, { useState } from 'react';

import { TreeBranch } from './TreeBranch';

export const Tree = ({ data }) => {
    return (
        <div style={{ width: '500px' }}>
            {data.map((item) => (
                <TreeBranch key={item.id} item={item} level={0} />
            ))}
        </div>
    );
};
