import type { TreeNode } from "@/components/Tree/types";
import rawTemplatesData from "@/assets/data/templatesTree.sample.json";

const MOCK_LATENCY_MS = 220;

function waitMs(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }

    if (signal?.aborted) {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export type ModelLevel = "Enterprise" | "Site" | "Area" | "Line" | "Workunit";
export type TemplateStatus = "Released" | "Draft" | "Deprecated";

export type TemplateCategoryParameter = {
  /** Unique instance id within this template */
  id: string;
  /** Global parameter id from the parameters table */
  parameterId: string;
  /** Custom display name for this instance */
  instanceName: string;
  dataType: string;
};

export type TemplateCategory = {
  id: string;
  name: string;
  sequence: number;
  parameters: TemplateCategoryParameter[];
  children: TemplateCategory[];
};

export type Template = {
  id: string;
  parentId: string | null;
  name: string;
  description: string;
  modelLevel: ModelLevel;
  status: TemplateStatus;
  inheritedLabels: string[];
  ownLabels: string[];
  categories: TemplateCategory[];
};

type TemplatesJsonPayload = Template[] | { data?: Template[] };

function normalizeTemplatesData(raw: unknown): Template[] {
  if (Array.isArray(raw)) {
    return raw as Template[];
  }

  if (
    raw !== null &&
    typeof raw === "object" &&
    "data" in raw &&
    Array.isArray((raw as { data?: unknown }).data)
  ) {
    return (raw as { data: Template[] }).data;
  }

  return [];
}

// ---- seed data ----

let _templatesStore: Template[] = normalizeTemplatesData(
  rawTemplatesData as TemplatesJsonPayload
);

let _nextId = 1;

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++_nextId}`;
}

// ---- tree building ----

export function buildTemplateTree(allTemplates: Template[]): TreeNode[] {
  const map = new Map<string, TreeNode & { children: TreeNode[] }>();
  for (const t of allTemplates) {
    map.set(t.id, { id: t.id, label: t.name, children: [] });
  }
  const roots: TreeNode[] = [];
  for (const t of allTemplates) {
    const node = map.get(t.id)!;
    if (t.parentId === null) {
      roots.push(node);
    } else {
      const parent = map.get(t.parentId);
      if (parent) {
        (parent.children as TreeNode[]).push(node);
      } else {
        roots.push(node);
      }
    }
  }
  return roots;
}

// ---- template CRUD ----

export async function fetchTemplates(signal?: AbortSignal): Promise<Template[]> {
  await waitMs(MOCK_LATENCY_MS, signal);
  return structuredClone(_templatesStore);
}

export async function createTemplate(
  payload: Omit<Template, "id">,
  signal?: AbortSignal
): Promise<Template> {
  await waitMs(MOCK_LATENCY_MS, signal);
  const newTemplate: Template = { ...structuredClone(payload), id: genId("tmpl") };
  _templatesStore = [..._templatesStore, newTemplate];
  return structuredClone(newTemplate);
}

export async function updateTemplate(
  id: string,
  patch: Partial<Omit<Template, "id">>,
  signal?: AbortSignal
): Promise<Template> {
  await waitMs(MOCK_LATENCY_MS, signal);
  _templatesStore = _templatesStore.map((t) => (t.id === id ? { ...t, ...patch } : t));
  const updated = _templatesStore.find((t) => t.id === id);
  if (!updated) throw new Error(`Template "${id}" not found`);
  return structuredClone(updated);
}

export async function deleteTemplateById(id: string, signal?: AbortSignal): Promise<void> {
  await waitMs(MOCK_LATENCY_MS, signal);
  const idsToRemove = new Set<string>();
  const collect = (targetId: string) => {
    idsToRemove.add(targetId);
    _templatesStore
      .filter((t) => t.parentId === targetId)
      .forEach((child) => collect(child.id));
  };
  collect(id);
  _templatesStore = _templatesStore.filter((t) => !idsToRemove.has(t.id));
}

// ---- category helpers ----

function insertCategory(
  categories: TemplateCategory[],
  parentId: string | null,
  newCat: TemplateCategory
): TemplateCategory[] {
  if (parentId === null) return [...categories, newCat];
  return categories.map((cat) => {
    if (cat.id === parentId) return { ...cat, children: [...cat.children, newCat] };
    return { ...cat, children: insertCategory(cat.children, parentId, newCat) };
  });
}

function removeCategory(categories: TemplateCategory[], id: string): TemplateCategory[] {
  return categories
    .filter((cat) => cat.id !== id)
    .map((cat) => ({ ...cat, children: removeCategory(cat.children, id) }));
}

function patchCategory(
  categories: TemplateCategory[],
  id: string,
  patch: Partial<Pick<TemplateCategory, "name" | "sequence">>
): TemplateCategory[] {
  return categories.map((cat) => {
    if (cat.id === id) return { ...cat, ...patch };
    return { ...cat, children: patchCategory(cat.children, id, patch) };
  });
}

function insertParamIntoCategory(
  categories: TemplateCategory[],
  categoryId: string,
  param: TemplateCategoryParameter
): TemplateCategory[] {
  return categories.map((cat) => {
    if (cat.id === categoryId) return { ...cat, parameters: [...cat.parameters, param] };
    return { ...cat, children: insertParamIntoCategory(cat.children, categoryId, param) };
  });
}

function removeParamById(
  categories: TemplateCategory[],
  paramId: string
): TemplateCategory[] {
  return categories.map((cat) => ({
    ...cat,
    parameters: cat.parameters.filter((p) => p.id !== paramId),
    children: removeParamById(cat.children, paramId),
  }));
}

// ---- category CRUD ----

export async function addCategoryToTemplate(
  templateId: string,
  parentCategoryId: string | null,
  name: string,
  sequence: number,
  signal?: AbortSignal
): Promise<Template> {
  await waitMs(MOCK_LATENCY_MS, signal);
  const newCat: TemplateCategory = {
    id: genId("cat"),
    name,
    sequence,
    parameters: [],
    children: [],
  };
  _templatesStore = _templatesStore.map((t) => {
    if (t.id !== templateId) return t;
    return { ...t, categories: insertCategory(t.categories, parentCategoryId, newCat) };
  });
  return structuredClone(_templatesStore.find((t) => t.id === templateId)!);
}

export async function deleteCategoryFromTemplate(
  templateId: string,
  categoryId: string,
  signal?: AbortSignal
): Promise<Template> {
  await waitMs(MOCK_LATENCY_MS, signal);
  _templatesStore = _templatesStore.map((t) => {
    if (t.id !== templateId) return t;
    return { ...t, categories: removeCategory(t.categories, categoryId) };
  });
  return structuredClone(_templatesStore.find((t) => t.id === templateId)!);
}

export async function updateCategoryInTemplate(
  templateId: string,
  categoryId: string,
  patch: Partial<Pick<TemplateCategory, "name" | "sequence">>,
  signal?: AbortSignal
): Promise<Template> {
  await waitMs(MOCK_LATENCY_MS, signal);
  _templatesStore = _templatesStore.map((t) => {
    if (t.id !== templateId) return t;
    return { ...t, categories: patchCategory(t.categories, categoryId, patch) };
  });
  return structuredClone(_templatesStore.find((t) => t.id === templateId)!);
}

// ---- parameter CRUD ----

export async function addParameterToTemplate(
  templateId: string,
  categoryId: string,
  param: Omit<TemplateCategoryParameter, "id">,
  signal?: AbortSignal
): Promise<Template> {
  await waitMs(MOCK_LATENCY_MS, signal);
  const newParam: TemplateCategoryParameter = { ...param, id: genId("prm") };
  _templatesStore = _templatesStore.map((t) => {
    if (t.id !== templateId) return t;
    return { ...t, categories: insertParamIntoCategory(t.categories, categoryId, newParam) };
  });
  return structuredClone(_templatesStore.find((t) => t.id === templateId)!);
}

export async function removeParameterFromTemplate(
  templateId: string,
  paramId: string,
  signal?: AbortSignal
): Promise<Template> {
  await waitMs(MOCK_LATENCY_MS, signal);
  _templatesStore = _templatesStore.map((t) => {
    if (t.id !== templateId) return t;
    return { ...t, categories: removeParamById(t.categories, paramId) };
  });
  return structuredClone(_templatesStore.find((t) => t.id === templateId)!);
}
