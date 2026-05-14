import type { TreeNode } from "../components/Tree/types";
import sampleRoots from "../assets/data/assetConfigurationTree.sample.json";

const MOCK_LATENCY_MS = 350;

/** FastAPI may return one root `{ id, label, children }` or `{ roots: [...] }` — coerce to `TreeNode[]`. */
function normalizeRoots(raw: unknown): TreeNode[] {
  let list: TreeNode[];

  if (Array.isArray(raw)) {
    list = raw as TreeNode[];
  } else if (
    raw !== null &&
    typeof raw === "object" &&
    "roots" in raw &&
    Array.isArray((raw as { roots: unknown }).roots)
  ) {
    list = (raw as { roots: TreeNode[] }).roots;
  } else if (
    raw !== null &&
    typeof raw === "object" &&
    "id" in (raw as object)
  ) {
    list = [raw as TreeNode];
  } else {
    list = [];
  }

  function normalizeNode(node: TreeNode): TreeNode {
    const nextChildren = node.children;
    const childrenArr: TreeNode[] = Array.isArray(nextChildren)
      ? nextChildren
      : [];
    return {
      ...node,
      children: childrenArr.map(normalizeNode),
    };
  }

  return list.map(normalizeNode);
}

export type FetchAssetConfigurationTreeOptions = {
  signal?: AbortSignal;
};

/**
 * Sample loader for the asset configuration tree. Uncomment the FastAPI branch when your backend is ready.
 */
export async function fetchAssetConfigurationTree(
  options?: FetchAssetConfigurationTreeOptions
): Promise<TreeNode[]> {
  const signal = options?.signal;

  await new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }
      resolve();
    }, MOCK_LATENCY_MS);

    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };

    if (signal) {
      if (signal.aborted) {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });

  /*
  const base = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
  const res = await fetch(`${base}/api/asset-configuration/tree`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Could not load asset configuration tree (${res.status})`);
  }
  const payload: unknown = await res.json();
  return normalizeRoots(payload);
  */

  return normalizeRoots(sampleRoots);
}
