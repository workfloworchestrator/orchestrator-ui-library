import * as React from 'react';
import { ReactNode } from 'react';

export type TreeContextType = {
    setDepths: (depths: number[]) => void;
    selectedIds: number[];
    expandedIds: number[];
    toggleSelectedId: (id: number) => void;
    expandNode: (id: number) => void;
    collapseNode: (id: number) => void;
    expandAll: () => void;
    collapseAll: () => void;
    resetSelection: () => void;
    selectAll: () => void;
    selectIds: (ids: number[]) => void;
};

export const TreeContext = React.createContext<TreeContextType | null>(null);

export type TreeProviderProps = {
    children: ReactNode;
};

export const TreeProvider: React.FC<TreeProviderProps> = ({ children }) => {
    const [depths, setDepths] = React.useState<number[]>([]);
    const [selectedIds, setSelectedIds] = React.useState<number[]>([0]);
    const [expandedIds, setExpandedIds] = React.useState<number[]>([0]);

    const toggleSelectedId = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds((prevSelectedIds) =>
                prevSelectedIds.filter((selectedId) => selectedId !== id),
            );
        } else {
            setSelectedIds((prevSelectedIds) => [...prevSelectedIds, id]);
        }
    };

    const selectAll = () => {
        setSelectedIds(Array.from(Array(depths.length).keys()));
    };

    const selectIds = (ids: number[]) => {
        setSelectedIds((prevSelectedIds) => {
            // Todo: only adds new id's, need to implement the removal of id's too
            return Array.from(new Set([...prevSelectedIds, ...ids]));
        });
    };

    const expandAll = () => {
        setExpandedIds(Array.from(Array(depths.length).keys()));
    };

    const collapseAll = () => {
        setExpandedIds([0]);
    };

    const expandNode = (itemIndex: number) => {
        const initialDepth = depths[itemIndex];
        const expandedNodeIds = depths
            .map((depth, i) => {
                if (
                    i === itemIndex ||
                    (i > itemIndex && depth > initialDepth)
                ) {
                    return i;
                }
                return -1;
            })
            .filter((nodeId) => nodeId !== -1);
        setExpandedIds((prevExpandedIds) => [
            ...prevExpandedIds,
            ...expandedNodeIds,
        ]);
    };

    const collapseNode = (itemIndex: number) => {
        const initialDepth = depths[itemIndex];
        const collapsedNodeIds: number[] = [];
        for (let i = itemIndex; i < depths.length; i++) {
            if (i === itemIndex) collapsedNodeIds.push(i);
            else if (depths[i] > initialDepth) collapsedNodeIds.push(i);
            else if (depths[i] <= initialDepth) break;
        }
        setExpandedIds((prevExpandedIds) =>
            prevExpandedIds.filter((id) => !collapsedNodeIds.includes(id)),
        );
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
                expandNode,
                collapseNode,
                expandAll,
                collapseAll,
                resetSelection,
                selectAll,
                selectIds,
            }}
        >
            {children}
        </TreeContext.Provider>
    );
};
