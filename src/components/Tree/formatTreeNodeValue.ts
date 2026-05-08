import type { TreeNode } from "./types";

export function formatTreeNodeValue(value: TreeNode["value"]): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}
