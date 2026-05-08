import type { TreeNode } from "./types";

/** Returns ids of nodes that own children (branch nodes), depth-first order. */
export function collectExpandableIds(nodes: TreeNode[]): string[] {
  if (!Array.isArray(nodes)) {
    return [];
  }
  const ids: string[] = [];
  for (const node of nodes) {
    const { children } = node;
    if (children?.length) {
      ids.push(node.id, ...collectExpandableIds(children));
    }
  }
  return ids;
}
