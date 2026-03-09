import { TreeBlock, WfoTreeNodeMap } from '@/types';

export function getWfoTreeNodeDepth(node: TreeBlock, idToNodeMap: WfoTreeNodeMap): number {
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

const countDescendantNodes = (node: TreeBlock): number => {
  let count = 0;
  for (const child of node.children) {
    count += 1 + countDescendantNodes(child);
  }
  return count;
};

/**
 * This function returns the position of a node in an ordered tree. To get
 * the position we start counting from 1 and keep incrementing for each
 * node and descendant node we encounter such that the difference in position
 * between two sibling nodes on the first level is the number the total number of descendants.
 * This cab then be used to determine how to order the display of a list of nodes based on their id.
 * @param tree
 * @param id
 * @returns number
 */
export const getPositionInTree = (tree: TreeBlock, id: number): number | undefined => {
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
        startPosition += countDescendantNodes(child);
      }
    }
  }

  return undefined;
};
