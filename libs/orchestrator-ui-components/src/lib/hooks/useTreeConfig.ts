import { useState } from 'react';

export enum Environment {
    DEVELOPMENT = 'Development',
    PRODUCTION = 'Production',
}

export type TreeConfig = {
    selectedIds: number[];
    expandedIds: number[];
    toggleSelectId: (id: number) => void;
    toggleExpandId: (id: number) => void;
};

export const useTreeConfig = (initialTreeConfig: TreeConfig) => {
    const [selectedIds] = useState(initialTreeConfig.selectedIds);

    return {
        TreeConfig,
    };
};
