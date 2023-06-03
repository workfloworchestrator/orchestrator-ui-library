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
            console.log(
                `Removing id: ${id} from selected id's => `,
                newSelectedIds,
            );
        } else {
            const newSelectedIds = [...selectedIds, id];
            setSelectedIds(newSelectedIds);
            console.log(
                `Adding id: ${id} to selected id's => `,
                newSelectedIds,
            );
        }
    };
    const toggleExpandedId = (id: number) => {
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

    const expandAll = (treeLength: number) => {
        const newExpandedIds = Array.from(Array(treeLength).keys());
        console.log(`Add all to expanded id's => `, newExpandedIds);
        setExpandedIds(newExpandedIds);
    };

    const collapseAll = () => {
        console.log("Removed all expanded id's");
        setExpandedIds([0]);
    };

    const resetSelection = () => {
        console.log("Removed all selected id's");
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
