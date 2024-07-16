import { TreeBlock, WfoTreeNodeMap } from '@/types';

export function getWfoTreeNodeDepth(
    node: TreeBlock,
    idToNodeMap: WfoTreeNodeMap,
): number {
    if (node.parent === null) {
        // This is the root node, so its depth is 0.
        return 0;
    } else {
        // Find the parent node.
        const parent = idToNodeMap[node.parent];
        if (parent) {
            // Recursively calculate the parent's depth and add 1.
            return getWfoTreeNodeDepth(parent, idToNodeMap) + 1;
        } else {
            // Parent not found, something might be wrong with the tree structure.
            throw new Error(`Parent node for ${node.id} not found.`);
        }
    }
}

export const sortTreeBlockByLabel = (
    { label: labelA, id: idA }: TreeBlock,
    { label: labelB, id: idB }: TreeBlock,
): number => {
    if (labelA === labelB) {
        if (idA < idB) {
            return -1;
        }
        if (idA > idB) {
            return 1;
        }
        return 0;
    }
    if (labelA < labelB) {
        return -1;
    }
    if (labelA > labelB) {
        return 1;
    }
    return 0;
};

const countChildeNodes = (node: TreeBlock): number => {
    let count = 0;
    for (const child of node.children) {
        count += 1 + countChildeNodes(child);
    }
    return count;
};

export const getPositionInTree = (
    tree: TreeBlock,
    id: number,
): number | undefined => {
    let startPosition = 1;
    if (tree.id === id) {
        return startPosition;
    }

    for (const child of tree.children) {
        startPosition += 1;
        if (child.id === id) {
            return startPosition;
        }
        if (child.children.length > 0) {
            const childPosition = getPositionInTree(child, id);
            if (childPosition) {
                return startPosition + childPosition - 1;
            } else {
                startPosition += countChildeNodes(child);
            }
        }
    }

    return undefined;
};
