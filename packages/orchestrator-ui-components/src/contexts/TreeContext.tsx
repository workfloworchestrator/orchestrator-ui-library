import * as React from 'react';
import { ReactNode } from 'react';

export type TreeContextType = {
    setDepths: (depths: number[]) => void;
    selectedIds: number[];
    expandedIds: number[];
    toggleSelectedId: (id: number) => void;
    toggleExpandedId: (id: number) => void;
    expandNode: (id: number) => void;
    expandAll: () => void;
    collapseAll: () => void;
    resetSelection: () => void;
};

export const TreeContext = React.createContext<TreeContextType | null>(null);

export type TreeProviderProps = {
    children: ReactNode;
};

export const TreeProvider: React.FC<TreeProviderProps> = ({ children }) => {
    const [depths, setDepths] = React.useState<number[]>([]);
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

    const expandAll = () => {
        const newExpandedIds = Array.from(Array(depths.length).keys());
        setExpandedIds(newExpandedIds);
    };

    const collapseAll = () => {
        console.log(depths);
        setExpandedIds([0]);
    };

    const expandNode = (itemIndex: number) => {
        const initialDepth = depths[itemIndex];
        const expandedNodeIds = [0];
        for (let i = itemIndex; i < depths.length; i++) {
            if (i === itemIndex) expandedNodeIds.push(i);
            else if (depths[i] > initialDepth) expandedNodeIds.push(i);
            else if (depths[i] <= initialDepth) break;
        }
        console.log('Expanded nodes', expandedNodeIds);
        setExpandedIds(expandedIds.concat(expandedNodeIds));
    };

    const resetSelection = () => {
        setSelectedIds([]);
    };

    return (
        <TreeContext.Provider
            value={{
                setDepths,
                selectedIds,
                expandedIds,
                toggleSelectedId,
                toggleExpandedId,
                expandNode,
                expandAll,
                collapseAll,
                resetSelection,
            }}
        >
            {children}
        </TreeContext.Provider>
    );
};
