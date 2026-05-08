/**
 * Generic tree node shape. Keep this aligned with future FastAPI responses
 * (e.g. `GET /api/parameters/tree`).
 */
export type TreeNode = {
  id: string;
  label: string;
  /** Optional value shown beside the label (parameter value, etc.) */
  value?: string | number | boolean | null;
  children?: TreeNode[];
};
