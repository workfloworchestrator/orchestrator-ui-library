import { TreeBlock, WfoTreeNodeMap } from '../../types';

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
    { label: labelA }: TreeBlock,
    { label: labelB }: TreeBlock,
): number => {
    if (labelA < labelB) {
        return -1;
    }
    if (labelA > labelB) {
        return 1;
    }
    return 0;
};
