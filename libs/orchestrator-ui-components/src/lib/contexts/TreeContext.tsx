import * as React from 'react';

export type TreeContextType = {
    selectedIds: number[];
    expandedIds: number[];
    toggleSelectId: (id: number) => void;
    toggleExpandId: (id: number) => void;
};

export const TreeContext = React.createContext<TreeContextType | null>(null);

export const TreeProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const [expandedIds, setExpandedIds] = React.useState<number[]>([
        0, 1, 2, 3, 4,
    ]);
    const toggleSelectId = (id: number) => {
        setSelectedIds([0]);
    };
    const toggleExpandId = (id: number) => {
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
        <TreeContext.Provider
            value={{ selectedIds, expandedIds, toggleSelectId, toggleExpandId }}
        >
            {children}
        </TreeContext.Provider>
    );
};
