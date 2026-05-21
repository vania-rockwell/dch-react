import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FolderPlus,
  LayoutTemplate,
  ListPlus,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import Badge from "@/components/Badge/Badge";
import { Button } from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";
import PageSection from "@/components/PageSection/PageSection";
import Select from "@/components/Select/Select";
import Snackbar, { type SnackbarVariant } from "@/components/Snackbar/Snackbar";
import { Spinner } from "@/components/Spinner/Spinner";
import { Tab, TabList, TabPanel, Tabs } from "@/components/Tabs/Tabs";
import { TreeView } from "@/components/Tree/TreeView";
import type { TreeNode } from "@/components/Tree/types";
import { fetchParametersTable, type ParameterTableRow } from "@/services/parametersService";
import {
  addCategoryToTemplate,
  addParameterToTemplate,
  buildTemplateTree,
  createTemplate,
  deleteCategoryFromTemplate,
  deleteTemplateById,
  fetchTemplates,
  removeParameterFromTemplate,
  updateCategoryInTemplate,
  updateTemplate,
  type ModelLevel,
  type Template,
  type TemplateCategory,
  type TemplateCategoryParameter,
  type TemplateStatus,
} from "../../services/templatesService";
import "./TemplatesPage.scss";

// ---- constants ----

const MODEL_LEVELS: ModelLevel[] = ["Enterprise", "Site", "Area", "Line", "Workunit"];
const STATUSES: TemplateStatus[] = ["Released", "Draft", "Deprecated"];

// ---- pure helpers ----

function filterTemplates(all: Template[], search: string): Template[] {
  const q = search.trim().toLowerCase();
  if (!q) return all;
  const matched = new Set<string>(
    all.filter((t) => t.name.toLowerCase().includes(q)).map((t) => t.id)
  );
  const addAncestors = (id: string) => {
    const t = all.find((x) => x.id === id);
    if (t?.parentId && !matched.has(t.parentId)) {
      matched.add(t.parentId);
      addAncestors(t.parentId);
    }
  };
  [...matched].forEach(addAncestors);
  return all.filter((t) => matched.has(t.id));
}

function getTemplateParentPath(all: Template[], id: string): string[] {
  const path: string[] = [];
  let current = all.find((t) => t.id === id);
  while (current?.parentId) {
    const parent = all.find((t) => t.id === current!.parentId);
    if (!parent) break;
    path.unshift(parent.name);
    current = parent;
  }
  return path;
}

function categoriesToTreeNodes(categories: TemplateCategory[]): TreeNode[] {
  return [...categories]
    .sort((a, b) => a.sequence - b.sequence)
    .map((cat) => ({
      id: cat.id,
      label: cat.name,
      children: [
        ...categoriesToTreeNodes(cat.children),
        ...cat.parameters.map(
          (p): TreeNode => ({ id: p.id, label: p.instanceName, value: p.dataType })
        ),
      ],
    }));
}

function collectCategoryIds(categories: TemplateCategory[]): Set<string> {
  const ids = new Set<string>();
  function collect(cats: TemplateCategory[]) {
    for (const cat of cats) {
      ids.add(cat.id);
      collect(cat.children);
    }
  }
  collect(categories);
  return ids;
}

type FoundNode =
  | { type: "category"; category: TemplateCategory }
  | { type: "parameter"; category: TemplateCategory; param: TemplateCategoryParameter };

function findInCategories(
  categories: TemplateCategory[],
  id: string
): FoundNode | null {
  for (const cat of categories) {
    if (cat.id === id) return { type: "category", category: cat };
    const param = cat.parameters.find((p) => p.id === id);
    if (param) return { type: "parameter", category: cat, param };
    const found = findInCategories(cat.children, id);
    if (found) return found;
  }
  return null;
}

function getCategoryParentPath(
  categories: TemplateCategory[],
  targetId: string,
  path: string[] = []
): string[] | null {
  for (const cat of categories) {
    if (cat.id === targetId) return path;
    const found = getCategoryParentPath(cat.children, targetId, [...path, cat.name]);
    if (found !== null) return found;
  }
  return null;
}

function getFlatCategories(
  categories: TemplateCategory[]
): Array<{ id: string; label: string; depth: number }> {
  const result: Array<{ id: string; label: string; depth: number }> = [];
  function collect(cats: TemplateCategory[], depth: number) {
    for (const cat of cats) {
      result.push({ id: cat.id, label: cat.name, depth });
      collect(cat.children, depth + 1);
    }
  }
  collect(categories, 0);
  return result;
}

// ---- DefinitionTab ----

type DefinitionTabProps = {
  template: Template;
  allTemplates: Template[];
  onSave: (patch: Partial<Template>) => Promise<void>;
};

function DefinitionTab({ template, allTemplates, onSave }: DefinitionTabProps) {
  const { t } = useTranslation(["pages", "common"]);
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description);
  const [modelLevel, setModelLevel] = useState<ModelLevel>(template.modelLevel);
  const [status, setStatus] = useState<TemplateStatus>(template.status);
  const [ownLabels, setOwnLabels] = useState<string[]>(template.ownLabels);
  const [labelInput, setLabelInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(template.name);
    setDescription(template.description);
    setModelLevel(template.modelLevel);
    setStatus(template.status);
    setOwnLabels(template.ownLabels);
    setLabelInput("");
  }, [template.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const parentPath = getTemplateParentPath(allTemplates, template.id);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ name, description, modelLevel, status, ownLabels });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(template.name);
    setDescription(template.description);
    setModelLevel(template.modelLevel);
    setStatus(template.status);
    setOwnLabels(template.ownLabels);
    setLabelInput("");
  };

  const handleAddLabel = () => {
    const trimmed = labelInput.trim();
    if (trimmed && !ownLabels.includes(trimmed)) {
      setOwnLabels((prev) => [...prev, trimmed]);
      setLabelInput("");
    }
  };

  const modelLevelOptions = MODEL_LEVELS.map((lvl) => ({ value: lvl, label: lvl }));
  const statusOptions = STATUSES.map((s) => ({ value: s, label: s }));

  return (
    <div className="tpl-definition">
      {parentPath.length > 0 && (
        <div className="tpl-definition__parent-path">
          <span className="tpl-definition__path-label">{t("pages:templates.fieldParent")}:</span>
          {parentPath.map((seg, i) => (
            <span key={i} className="tpl-definition__path-seg">
              {i > 0 && <ChevronRight size={12} aria-hidden />}
              {seg}
            </span>
          ))}
        </div>
      )}

      <div className="tpl-definition__grid">
        <div className="tpl-definition__field">
          <label className="tpl-definition__label">{t("pages:templates.fieldName")}</label>
          <Input
            size="sm"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="tpl-definition__field">
          <label className="tpl-definition__label">{t("pages:templates.fieldModelLevel")}</label>
          <Select
            options={modelLevelOptions}
            value={modelLevel}
            onChange={(e) => setModelLevel(e.target.value as ModelLevel)}
            fullWidth
            size="sm"
          />
        </div>
        <div className="tpl-definition__field">
          <label className="tpl-definition__label">{t("pages:templates.fieldDescription")}</label>
          <Input
            size="sm"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="tpl-definition__field">
          <label className="tpl-definition__label">{t("pages:templates.fieldStatus")}</label>
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as TemplateStatus)}
            fullWidth
            size="sm"
          />
        </div>
      </div>

      {template.inheritedLabels.length > 0 && (
        <div className="tpl-definition__section">
          <p className="tpl-definition__section-title">{t("pages:templates.fieldInheritedLabels")}</p>
          <div className="tpl-definition__labels">
            {template.inheritedLabels.map((lbl) => (
              <Badge key={lbl} color="gray" size="sm">
                {lbl}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="tpl-definition__section">
        <p className="tpl-definition__section-title">{t("pages:templates.fieldOwnLabels")}</p>
        <div className="tpl-definition__labels">
          {ownLabels.length > 0 ? (
            ownLabels.map((lbl) => (
              <span key={lbl} className="tpl-definition__label-pill">
                {lbl}
                <button
                  type="button"
                  className="tpl-definition__label-remove"
                  aria-label={`${t("pages:templates.removeLabelAria")} ${lbl}`}
                  onClick={() => setOwnLabels((prev) => prev.filter((l) => l !== lbl))}
                >
                  <X size={10} aria-hidden />
                </button>
              </span>
            ))
          ) : (
            <span className="tpl-definition__no-labels">—</span>
          )}
        </div>
        <div className="tpl-definition__label-add">
          <Input
            size="sm"
            placeholder={t("pages:templates.labelPlaceholder")}
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddLabel();
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={handleAddLabel}
            disabled={!labelInput.trim()}
          >
            {t("common:actions.add")}
          </Button>
        </div>
      </div>

      <div className="tpl-definition__actions">
        <Button variant="secondary" size="sm" onClick={handleCancel} disabled={isSaving}>
          {t("common:actions.cancel")}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={isSaving || !name.trim()}
        >
          {isSaving ? <Spinner size="sm" /> : t("common:actions.save")}
        </Button>
      </div>
    </div>
  );
}

// ---- ParametersTab ----

type ParametersTabProps = {
  template: Template;
  onTemplateChange: (updated: Template) => void;
  onSnack: (msg: string, variant?: SnackbarVariant) => void;
};

function ParametersTab({ template, onTemplateChange, onSnack }: ParametersTabProps) {
  const { t } = useTranslation(["pages", "common"]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modals
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [addParamOpen, setAddParamOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Add category form
  const [catName, setCatName] = useState("");
  const [catSeq, setCatSeq] = useState(1);
  const [catParentId, setCatParentId] = useState<string>("__root__");
  const [isSavingCat, setIsSavingCat] = useState(false);

  // Add parameter form
  const [availableParams, setAvailableParams] = useState<ParameterTableRow[]>([]);
  const [paramsLoading, setParamsLoading] = useState(false);
  const [paramSearch, setParamSearch] = useState("");
  const [pickedParamId, setPickedParamId] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [isSavingParam, setIsSavingParam] = useState(false);

  // Category inline edit
  const [catEditName, setCatEditName] = useState("");
  const [catEditSeq, setCatEditSeq] = useState(1);
  const [isSavingCatEdit, setIsSavingCatEdit] = useState(false);

  // Delete
  const [isDeleting, setIsDeleting] = useState(false);

  // Derived
  const categoryIds = useMemo(
    () => collectCategoryIds(template.categories),
    [template.categories]
  );
  const categoryTreeNodes = useMemo(
    () => categoriesToTreeNodes(template.categories),
    [template.categories]
  );
  const flatCategories = useMemo(
    () => getFlatCategories(template.categories),
    [template.categories]
  );

  const selectedNode = useMemo(
    () => (selectedNodeId ? findInCategories(template.categories, selectedNodeId) : null),
    [template.categories, selectedNodeId]
  );

  // Reset selection when template changes
  useEffect(() => {
    setSelectedNodeId(null);
  }, [template.id]);

  // Sync category edit draft when selection changes
  useEffect(() => {
    if (selectedNode?.type === "category") {
      setCatEditName(selectedNode.category.name);
      setCatEditSeq(selectedNode.category.sequence);
    }
  }, [selectedNode]);

  // Load available params when the modal opens
  useEffect(() => {
    if (!addParamOpen) return undefined;
    setParamsLoading(true);
    const controller = new AbortController();
    void fetchParametersTable({ signal: controller.signal })
      .then(setAvailableParams)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        onSnack(t("pages:templates.loadError"), "danger");
      })
      .finally(() => setParamsLoading(false));
    return () => controller.abort();
  }, [addParamOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fill instance name when a parameter is picked
  useEffect(() => {
    const found = availableParams.find((p) => p.id === pickedParamId);
    if (found) setInstanceName(found.parameterName);
  }, [pickedParamId, availableParams]);

  // Derived: target category for "Add Parameter"
  const targetCategory =
    selectedNode?.type === "category"
      ? selectedNode.category
      : selectedNode?.type === "parameter"
        ? selectedNode.category
        : null;

  const parentCategoryOptions = useMemo(
    () => [
      { value: "__root__", label: t("pages:templates.categoryRoot") },
      ...flatCategories.map((cat) => ({
        value: cat.id,
        label: `${"  ".repeat(cat.depth)}${cat.label}`,
      })),
    ],
    [flatCategories, t]
  );

  const filteredParams = useMemo(() => {
    const q = paramSearch.trim().toLowerCase();
    if (!q) return availableParams;
    return availableParams.filter(
      (p) =>
        p.parameterName.toLowerCase().includes(q) || p.dataType.toLowerCase().includes(q)
    );
  }, [availableParams, paramSearch]);

  const parentPathForCat = useMemo(() => {
    if (!selectedNode || selectedNode.type !== "category") return null;
    return getCategoryParentPath(template.categories, selectedNode.category.id) ?? [];
  }, [selectedNode, template.categories]);

  // Handlers
  const handleAddCategory = async () => {
    const parentId = catParentId === "__root__" ? null : catParentId;
    setIsSavingCat(true);
    try {
      const updated = await addCategoryToTemplate(
        template.id,
        parentId,
        catName.trim(),
        catSeq
      );
      onTemplateChange(updated);
      setAddCatOpen(false);
      setCatName("");
      setCatSeq(1);
      setCatParentId("__root__");
      onSnack(t("pages:templates.categoryAdded"), "success");
    } catch {
      onSnack(t("pages:templates.loadError"), "danger");
    } finally {
      setIsSavingCat(false);
    }
  };

  const handleAddParam = async () => {
    if (!pickedParamId || !targetCategory) return;
    const param = availableParams.find((p) => p.id === pickedParamId);
    if (!param) return;
    setIsSavingParam(true);
    try {
      const updated = await addParameterToTemplate(template.id, targetCategory.id, {
        parameterId: param.id,
        instanceName: instanceName.trim() || param.parameterName,
        dataType: param.dataType,
      });
      onTemplateChange(updated);
      setAddParamOpen(false);
      setPickedParamId("");
      setInstanceName("");
      setParamSearch("");
      onSnack(t("pages:templates.parameterAdded"), "success");
    } catch {
      onSnack(t("pages:templates.loadError"), "danger");
    } finally {
      setIsSavingParam(false);
    }
  };

  const handleDeleteNode = async () => {
    if (!selectedNodeId || !selectedNode) return;
    setIsDeleting(true);
    try {
      const updated =
        selectedNode.type === "category"
          ? await deleteCategoryFromTemplate(template.id, selectedNodeId)
          : await removeParameterFromTemplate(template.id, selectedNodeId);
      onTemplateChange(updated);
      setSelectedNodeId(null);
      setDeleteOpen(false);
      onSnack(t("pages:templates.nodeDeleted"), "success");
    } catch {
      onSnack(t("pages:templates.loadError"), "danger");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCatEdit = async () => {
    if (!selectedNode || selectedNode.type !== "category") return;
    setIsSavingCatEdit(true);
    try {
      const updated = await updateCategoryInTemplate(
        template.id,
        selectedNode.category.id,
        { name: catEditName.trim(), sequence: catEditSeq }
      );
      onTemplateChange(updated);
      onSnack(t("pages:templates.definitionSaved"), "success");
    } catch {
      onSnack(t("pages:templates.loadError"), "danger");
    } finally {
      setIsSavingCatEdit(false);
    }
  };

  const renderLabel = useCallback(
    (node: TreeNode) => {
      const isCat = categoryIds.has(node.id);
      return (
        <span className={`tpl-param-node tpl-param-node--${isCat ? "cat" : "param"}`}>
          {isCat ? (
            <Folder size={14} aria-hidden />
          ) : (
            <Tag size={12} aria-hidden />
          )}
          <span className="tpl-param-node__label">{node.label}</span>
          {!isCat && node.value && (
            <Badge size="sm" color="secondary">
              {String(node.value)}
            </Badge>
          )}
        </span>
      );
    },
    [categoryIds]
  );

  return (
    <>
      <div className="tpl-params">
        {/* Toolbar */}
        <div className="tpl-params__toolbar">
          <Button
            size="sm"
            variant="secondary"
            icon={FolderPlus}
            onClick={() => {
              setCatName("");
              setCatSeq(flatCategories.length + 1);
              setCatParentId(
                selectedNode?.type === "category" ? selectedNode.category.id : "__root__"
              );
              setAddCatOpen(true);
            }}
          >
            {t("pages:templates.addCategoryTitle")}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={ListPlus}
            disabled={!targetCategory}
            title={
              !targetCategory ? t("pages:templates.selectCategoryFirst") : undefined
            }
            onClick={() => {
              setPickedParamId("");
              setInstanceName("");
              setParamSearch("");
              setAddParamOpen(true);
            }}
          >
            {t("pages:templates.addParameterTitle")}
          </Button>
          {selectedNodeId && (
            <Button
              size="sm"
              variant="danger"
              icon={Trash2}
              onClick={() => setDeleteOpen(true)}
            >
              {t("common:actions.delete")}
            </Button>
          )}
        </div>

        {/* Body */}
        {template.categories.length === 0 ? (
          <div className="tpl-params__empty">
            <FolderOpen size={40} aria-hidden />
            <p>{t("pages:templates.noCategories")}</p>
          </div>
        ) : (
          <div className="tpl-params__body">
            {/* Category tree */}
            <div className="tpl-params__tree">
              <TreeView
                data={categoryTreeNodes}
                renderLabel={renderLabel}
                selectedId={selectedNodeId}
                onSelect={(node) =>
                  setSelectedNodeId((prev) => (prev === node.id ? null : node.id))
                }
              />
            </div>

            {/* Detail panel */}
            <div className="tpl-params__detail">
              {!selectedNode ? (
                <div className="tpl-params__detail-placeholder">
                  <Tag size={32} aria-hidden />
                  <p>{t("pages:templates.detailPlaceholder")}</p>
                </div>
              ) : selectedNode.type === "category" ? (
                <div className="tpl-cat-detail">
                  <p className="tpl-cat-detail__kind">{t("pages:templates.categoryDetail")}</p>
                  {parentPathForCat && parentPathForCat.length > 0 && (
                    <div className="tpl-cat-detail__breadcrumb">
                      <span>{t("pages:templates.fieldParent")}:</span>
                      {parentPathForCat.map((seg, i) => (
                        <span key={i} className="tpl-cat-detail__breadcrumb-seg">
                          {i > 0 && <ChevronRight size={10} aria-hidden />}
                          {seg}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="tpl-cat-detail__fields">
                    <div>
                      <label className="tpl-definition__label">
                        {t("pages:templates.fieldCategoryName")}
                      </label>
                      <Input
                        size="sm"
                        fullWidth
                        value={catEditName}
                        onChange={(e) => setCatEditName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="tpl-definition__label">
                        {t("pages:templates.fieldSequence")}
                      </label>
                      <Input
                        size="sm"
                        type="number"
                        value={catEditSeq}
                        onChange={(e) => setCatEditSeq(Number(e.target.value))}
                        style={{ width: "6rem" }}
                      />
                    </div>
                  </div>
                  <div className="tpl-cat-detail__actions">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isSavingCatEdit}
                      onClick={() => {
                        setCatEditName(selectedNode.category.name);
                        setCatEditSeq(selectedNode.category.sequence);
                      }}
                    >
                      {t("common:actions.cancel")}
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={isSavingCatEdit || !catEditName.trim()}
                      onClick={handleSaveCatEdit}
                    >
                      {isSavingCatEdit ? <Spinner size="sm" /> : t("common:actions.save")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="tpl-cat-detail">
                  <p className="tpl-cat-detail__kind">{t("pages:templates.parameterDetail")}</p>
                  <div className="tpl-cat-detail__breadcrumb">
                    <span>{t("pages:templates.fieldParent")}:</span>
                    <span className="tpl-cat-detail__breadcrumb-seg">
                      {selectedNode.category.name}
                    </span>
                  </div>
                  <div className="tpl-cat-detail__fields tpl-cat-detail__fields--readonly">
                    <div>
                      <p className="tpl-definition__label">
                        {t("pages:templates.fieldInstanceName")}
                      </p>
                      <p className="tpl-cat-detail__value">{selectedNode.param.instanceName}</p>
                    </div>
                    <div>
                      <p className="tpl-definition__label">
                        {t("pages:templates.fieldDataType")}
                      </p>
                      <Badge size="sm" color="secondary">
                        {selectedNode.param.dataType}
                      </Badge>
                    </div>
                    <div>
                      <p className="tpl-definition__label">
                        {t("pages:templates.fieldParameterRef")}
                      </p>
                      <Badge size="sm" color="gray">
                        {selectedNode.param.parameterId}
                      </Badge>
                    </div>
                  </div>
                  <div className="tpl-cat-detail__actions">
                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => setDeleteOpen(true)}
                    >
                      {t("common:actions.delete")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        open={addCatOpen}
        title={t("pages:templates.addCategoryTitle")}
        onClose={() => setAddCatOpen(false)}
        size="sm"
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAddCatOpen(false)}
              disabled={isSavingCat}
            >
              {t("common:actions.cancel")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddCategory}
              disabled={isSavingCat || !catName.trim()}
            >
              {isSavingCat ? <Spinner size="sm" /> : t("common:actions.add")}
            </Button>
          </>
        }
      >
        <div className="tpl-modal-form">
          <div className="tpl-modal-form__field">
            <label className="tpl-definition__label">
              {t("pages:templates.fieldParentCategory")}
            </label>
            <Select
              options={parentCategoryOptions}
              value={catParentId}
              onChange={(e) => setCatParentId(e.target.value)}
              fullWidth
              size="sm"
            />
          </div>
          <div className="tpl-modal-form__field">
            <label className="tpl-definition__label">
              {t("pages:templates.fieldCategoryName")}
            </label>
            <Input
              size="sm"
              fullWidth
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && catName.trim()) void handleAddCategory();
              }}
            />
          </div>
          <div className="tpl-modal-form__field">
            <label className="tpl-definition__label">
              {t("pages:templates.fieldSequence")}
            </label>
            <Input
              size="sm"
              type="number"
              value={catSeq}
              onChange={(e) => setCatSeq(Number(e.target.value))}
              style={{ width: "6rem" }}
            />
          </div>
        </div>
      </Modal>

      {/* Add Parameter Modal */}
      <Modal
        open={addParamOpen}
        title={t("pages:templates.addParameterTitle")}
        onClose={() => setAddParamOpen(false)}
        size="md"
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAddParamOpen(false)}
              disabled={isSavingParam}
            >
              {t("common:actions.cancel")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddParam}
              disabled={isSavingParam || !pickedParamId}
            >
              {isSavingParam ? <Spinner size="sm" /> : t("common:actions.add")}
            </Button>
          </>
        }
      >
        {targetCategory && (
          <p className="tpl-param-picker__context">
            {t("pages:templates.addingTo")} <strong>{targetCategory.name}</strong>
          </p>
        )}
        <div className="tpl-param-picker">
          <Input
            size="sm"
            fullWidth
            placeholder={t("pages:templates.parameterSearch")}
            value={paramSearch}
            onChange={(e) => setParamSearch(e.target.value)}
            autoFocus
          />
          <div className="tpl-param-picker__list" role="listbox">
            {paramsLoading ? (
              <div className="tpl-param-picker__loader">
                <Spinner size="sm" />
              </div>
            ) : filteredParams.length === 0 ? (
              <p className="tpl-param-picker__empty">
                {t("pages:templates.noParameters")}
              </p>
            ) : (
              filteredParams.map((p) => (
                <div
                  key={p.id}
                  role="option"
                  aria-selected={pickedParamId === p.id}
                  className={`tpl-param-picker__item${pickedParamId === p.id ? " tpl-param-picker__item--selected" : ""}`}
                  onClick={() => setPickedParamId(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setPickedParamId(p.id);
                  }}
                  tabIndex={0}
                >
                  <span className="tpl-param-picker__item-name">{p.parameterName}</span>
                  <Badge size="sm" color="gray">
                    {p.dataType}
                  </Badge>
                  {p.capabilityDomains.map((d) => (
                    <Badge key={d.id} size="sm" color={d.color}>
                      {d.label}
                    </Badge>
                  ))}
                </div>
              ))
            )}
          </div>
          <div className="tpl-param-picker__instance">
            <label className="tpl-definition__label">
              {t("pages:templates.fieldInstanceName")}
            </label>
            <Input
              size="sm"
              fullWidth
              placeholder={t("pages:templates.fieldInstanceName")}
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Delete confirmation Modal */}
      <Modal
        open={deleteOpen}
        title={t("pages:templates.deleteNodeTitle")}
        onClose={() => setDeleteOpen(false)}
        size="sm"
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              {t("common:actions.cancel")}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteNode}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner size="sm" /> : t("common:actions.delete")}
            </Button>
          </>
        }
      >
        <p className="tpl-modal-form__warning">
          {selectedNode?.type === "category"
            ? t("pages:templates.deleteCategoryBody")
            : t("pages:templates.deleteParameterBody")}
        </p>
      </Modal>
    </>
  );
}

// ---- Main page ----

export default function TemplatesPage() {
  const { t } = useTranslation(["pages", "common"]);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [treeSearch, setTreeSearch] = useState("");

  // Snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackVariant, setSnackVariant] = useState<SnackbarVariant>("success");

  // Add template modal
  const [addTplOpen, setAddTplOpen] = useState(false);
  const [addTplName, setAddTplName] = useState("");
  const [addTplDesc, setAddTplDesc] = useState("");
  const [addTplLevel, setAddTplLevel] = useState<ModelLevel>("Workunit");
  const [addTplStatus, setAddTplStatus] = useState<TemplateStatus>("Draft");
  const [isAddingTpl, setIsAddingTpl] = useState(false);

  // Delete template modal
  const [deleteTplOpen, setDeleteTplOpen] = useState(false);
  const [isDeletingTpl, setIsDeletingTpl] = useState(false);

  // Load on mount
  useEffect(() => {
    const ctrl = new AbortController();
    setIsLoading(true);
    void fetchTemplates(ctrl.signal)
      .then((data) => {
        setTemplates(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setLoadError(t("pages:templates.loadError"));
        setIsLoading(false);
      });
    return () => ctrl.abort();
  }, [t]);

  // Derived
  const filteredTemplates = useMemo(
    () => filterTemplates(templates, treeSearch),
    [templates, treeSearch]
  );
  const treeData = useMemo(
    () => buildTemplateTree(filteredTemplates),
    [filteredTemplates]
  );
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedId) ?? null,
    [templates, selectedId]
  );
  const parentPath = useMemo(
    () => (selectedId ? getTemplateParentPath(templates, selectedId) : []),
    [templates, selectedId]
  );

  const showSnack = useCallback(
    (msg: string, variant: SnackbarVariant = "success") => {
      setSnackMsg(msg);
      setSnackVariant(variant);
      setSnackOpen(true);
    },
    []
  );

  const handleAddTemplate = async () => {
    setIsAddingTpl(true);
    try {
      const newTpl = await createTemplate({
        parentId: selectedId,
        name: addTplName.trim(),
        description: addTplDesc.trim(),
        modelLevel: addTplLevel,
        status: addTplStatus,
        inheritedLabels: [],
        ownLabels: [],
        categories: [],
      });
      setTemplates((prev) => [...prev, newTpl]);
      setAddTplOpen(false);
      setAddTplName("");
      setAddTplDesc("");
      setAddTplLevel("Workunit");
      setAddTplStatus("Draft");
      setSelectedId(newTpl.id);
      showSnack(t("pages:templates.templateAdded"), "success");
    } catch {
      showSnack(t("pages:templates.loadError"), "danger");
    } finally {
      setIsAddingTpl(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedId) return;
    setIsDeletingTpl(true);
    try {
      await deleteTemplateById(selectedId);
      setTemplates((prev) => {
        const idsToRemove = new Set<string>();
        const collect = (id: string) => {
          idsToRemove.add(id);
          prev.filter((t) => t.parentId === id).forEach((c) => collect(c.id));
        };
        collect(selectedId);
        return prev.filter((t) => !idsToRemove.has(t.id));
      });
      setSelectedId(null);
      setDeleteTplOpen(false);
      showSnack(t("pages:templates.templateDeleted"), "success");
    } catch {
      showSnack(t("pages:templates.loadError"), "danger");
    } finally {
      setIsDeletingTpl(false);
    }
  };

  const handleSaveDefinition = useCallback(
    async (patch: Partial<Template>) => {
      if (!selectedId) return;
      const updated = await updateTemplate(selectedId, patch);
      setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      showSnack(t("pages:templates.definitionSaved"), "success");
    },
    [selectedId, showSnack, t]
  );

  const handleTemplateChange = useCallback((updated: Template) => {
    setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }, []);

  const modelLevelOptions = MODEL_LEVELS.map((lvl) => ({ value: lvl, label: lvl }));
  const statusOptions = STATUSES.map((s) => ({ value: s, label: s }));

  const statusColor = (s: TemplateStatus) =>
    s === "Released" ? "success" : s === "Draft" ? "warning" : "danger";

  return (
    <div className="templates-page">
      <PageSection
        title={t("pages:templates.title")}
      >
        {isLoading ? (
          <div className="templates-page__loader">
            <Spinner size="lg" />
            <p>{t("pages:templates.loading")}</p>
          </div>
        ) : loadError ? (
          <div className="templates-page__error">{loadError}</div>
        ) : (
          <div className="tpl-explorer">
            {/* LEFT: template tree */}
            <div className="tpl-tree-panel">
              <div className="tpl-tree-panel__search">
                <Input
                  size="sm"
                  fullWidth
                  placeholder={`${t("common:actions.search")}…`}
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                />
              </div>
              <div className="tpl-tree-panel__actions">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Plus}
                  fullWidth
                  onClick={() => {
                    setAddTplName("");
                    setAddTplDesc("");
                    setAddTplLevel("Workunit");
                    setAddTplStatus("Draft");
                    setAddTplOpen(true);
                  }}
                >
                  {t("pages:templates.addTemplateTitle")}
                </Button>
                {selectedId && (
                  <Button
                    size="sm"
                    variant="danger"
                    icon={Trash2}
                    fullWidth
                    onClick={() => setDeleteTplOpen(true)}
                  >
                    {t("common:actions.delete")}
                  </Button>
                )}
              </div>
              <div className="tpl-tree-panel__tree">
                {treeData.length === 0 ? (
                  <p className="tpl-tree-panel__empty">
                    {treeSearch ? t("pages:templates.noResults") : t("pages:templates.empty")}
                  </p>
                ) : (
                  <TreeView
                    data={treeData}
                    selectedId={selectedId}
                    onSelect={(node) =>
                      setSelectedId((prev) => (prev === node.id ? null : node.id))
                    }
                  />
                )}
              </div>
            </div>

            {/* RIGHT: detail panel */}
            <div className="tpl-detail-panel">
              {!selectedTemplate ? (
                <div className="tpl-detail-panel__placeholder">
                  <LayoutTemplate size={52} aria-hidden />
                  <p>{t("pages:templates.noSelection")}</p>
                </div>
              ) : (
                <>
                  <div className="tpl-detail-panel__header">
                    <div className="tpl-detail-panel__header-text">
                      <h2 className="tpl-detail-panel__title">{selectedTemplate.name}</h2>
                      {parentPath.length > 0 && (
                        <p className="tpl-detail-panel__breadcrumb">
                          {parentPath.join(" › ")}
                        </p>
                      )}
                    </div>
                    <Badge color={statusColor(selectedTemplate.status)} size="sm">
                      {selectedTemplate.status}
                    </Badge>
                  </div>

                  <Tabs
                    key={selectedTemplate.id}
                    defaultValue="definition"
                    className="tpl-detail-tabs"
                  >
                    <TabList aria-label={t("pages:templates.tabsAriaLabel")}>
                      <Tab value="definition">{t("pages:templates.tabDefinition")}</Tab>
                      <Tab value="parameters">{t("pages:templates.tabParameters")}</Tab>
                    </TabList>
                    <TabPanel value="definition">
                      <DefinitionTab
                        key={selectedTemplate.id}
                        template={selectedTemplate}
                        allTemplates={templates}
                        onSave={handleSaveDefinition}
                      />
                    </TabPanel>
                    <TabPanel value="parameters">
                      <ParametersTab
                        key={selectedTemplate.id}
                        template={selectedTemplate}
                        onTemplateChange={handleTemplateChange}
                        onSnack={showSnack}
                      />
                    </TabPanel>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        )}
      </PageSection>

      {/* Add Template Modal */}
      <Modal
        open={addTplOpen}
        title={t("pages:templates.addTemplateTitle")}
        onClose={() => setAddTplOpen(false)}
        size="sm"
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAddTplOpen(false)}
              disabled={isAddingTpl}
            >
              {t("common:actions.cancel")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddTemplate}
              disabled={isAddingTpl || !addTplName.trim()}
            >
              {isAddingTpl ? <Spinner size="sm" /> : t("common:actions.create")}
            </Button>
          </>
        }
      >
        <div className="tpl-modal-form">
          {selectedId && (
            <p className="tpl-modal-form__context">
              {t("pages:templates.fieldParent")}:{" "}
              <strong>{selectedTemplate?.name ?? ""}</strong>
            </p>
          )}
          <div className="tpl-modal-form__field">
            <label className="tpl-definition__label">{t("pages:templates.fieldName")}</label>
            <Input
              size="sm"
              fullWidth
              value={addTplName}
              onChange={(e) => setAddTplName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && addTplName.trim()) void handleAddTemplate();
              }}
            />
          </div>
          <div className="tpl-modal-form__field">
            <label className="tpl-definition__label">
              {t("pages:templates.fieldDescription")}
            </label>
            <Input
              size="sm"
              fullWidth
              value={addTplDesc}
              onChange={(e) => setAddTplDesc(e.target.value)}
            />
          </div>
          <div className="tpl-modal-form__field">
            <label className="tpl-definition__label">
              {t("pages:templates.fieldModelLevel")}
            </label>
            <Select
              options={modelLevelOptions}
              value={addTplLevel}
              onChange={(e) => setAddTplLevel(e.target.value as ModelLevel)}
              fullWidth
              size="sm"
            />
          </div>
          <div className="tpl-modal-form__field">
            <label className="tpl-definition__label">{t("pages:templates.fieldStatus")}</label>
            <Select
              options={statusOptions}
              value={addTplStatus}
              onChange={(e) => setAddTplStatus(e.target.value as TemplateStatus)}
              fullWidth
              size="sm"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Template Modal */}
      <Modal
        open={deleteTplOpen}
        title={t("pages:templates.deleteTemplateTitle")}
        onClose={() => setDeleteTplOpen(false)}
        size="sm"
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteTplOpen(false)}
              disabled={isDeletingTpl}
            >
              {t("common:actions.cancel")}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteTemplate}
              disabled={isDeletingTpl}
            >
              {isDeletingTpl ? <Spinner size="sm" /> : t("common:actions.delete")}
            </Button>
          </>
        }
      >
        <p className="tpl-modal-form__warning">{t("pages:templates.deleteTemplateBody")}</p>
      </Modal>

      <Snackbar
        open={snackOpen}
        message={snackMsg}
        variant={snackVariant}
        onClose={() => setSnackOpen(false)}
      />
    </div>
  );
}
