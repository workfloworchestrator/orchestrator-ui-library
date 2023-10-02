import * as React from 'react';
import { ReactNode } from 'react';

export type TreeContextType = {
    selectedIds: number[];
    expandedIds: number[];
    toggleSelectedId: (id: number) => void;
    toggleExpandedId: (id: number) => void;
    expandAll: (treeLength: number) => void;
    collapseAll: () => void;
    resetSelection: () => void;
};

export const TreeContext = React.createContext<TreeContextType | null>(null);

export type TreeProviderProps = {
    children: ReactNode;
};

export const TreeProvider: React.FC<TreeProviderProps> = ({ children }) => {
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const [expandedIds, setExpandedIds] = React.useState<number[]>([0]);

    const toggleSelectedId = (id: number) => {
        if (selectedIds.includes(id)) {
            const newSelectedIds = selectedIds.filter(
                (selectedId) => selectedId !== id,
            );
            setSelectedIds(newSelectedIds);
        } else {
            const newSelectedIds = [...selectedIds, id];
            setSelectedIds(newSelectedIds);
        }
    };

    const toggleExpandedId = (id: number) => {
        if (expandedIds.includes(id)) {
            const newExpandedIds = expandedIds.filter(
                (expandedId) => expandedId !== id,
            );
            setExpandedIds(newExpandedIds);
        } else {
            const newExpandedIds = [...expandedIds, id];
            setExpandedIds(newExpandedIds);
        }
    };

    const expandAll = (treeLength: number) => {
        const newExpandedIds = Array.from(Array(treeLength).keys());
        setExpandedIds(newExpandedIds);
    };

    const collapseAll = () => {
        setExpandedIds([0]);
    };

    const resetSelection = () => {
        setSelectedIds([]);
    };

    return (
        <TreeContext.Provider
            value={{
                selectedIds,
                expandedIds,
                toggleSelectedId,
                toggleExpandedId,
                expandAll,
                collapseAll,
                resetSelection,
            }}
        >
            {children}
        </TreeContext.Provider>
    );
};
