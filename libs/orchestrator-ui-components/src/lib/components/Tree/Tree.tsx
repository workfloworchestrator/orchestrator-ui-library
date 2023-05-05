import React, { useState } from 'react';

import { TreeBranch } from './TreeBranch';

export const Tree = ({ data }) => {
    const initialExpandedIds = data
        .filter((item) => item.parent === null)
        .map((item) => item.id);
    // console.log("Initial expanded IDs: ", initialExpandedIds)
    // const [expandedIds, setExpandedIds] = useState(data.map(item) => ({}));
    const [expandedIds, setExpandedIds] = useState(initialExpandedIds);
    const [selectedIds, setSelectedIds] = useState([]);

    const onExpandChange = (id) => {
        if (expandedIds.includes(id)) {
            const newExpandedIds = expandedIds.filter(
                (expandedId) => expandedId !== id,
            );
            setExpandedIds(newExpandedIds);
            console.log(
                `Removing id: ${id} from expanded id's => `,
                newExpandedIds,
            );
        } else {
            const newExpandedIds = [...expandedIds, id];
            setExpandedIds(newExpandedIds);
            console.log(
                `Adding id: ${id} to expanded id's => `,
                newExpandedIds,
            );
        }
    };

    return (
        <div style={{ width: '500px' }}>
            <button onClick={() => setExpandedIds([0, 1, 2, 3, 4, 5])}>
                Yolo
            </button>
            {data.map((item) => (
                <TreeBranch
                    key={item.id}
                    item={item}
                    level={0}
                    // expandedIds={expandedIds}
                    // onExpandChange={onExpandChange}
                />
            ))}
        </div>
    );
};
