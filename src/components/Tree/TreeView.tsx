import { ChevronDown, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { TreeNode } from "./types";
import { collectExpandableIds } from "./collectExpandableIds";
import "./TreeView.scss";

type TreeItemProps = {
  node: TreeNode;
  expandedIds: ReadonlySet<string>;
  onToggle: (id: string) => void;
  renderLabel?: (node: TreeNode) => ReactNode;
  selectedId?: string | null;
  onSelect?: (node: TreeNode) => void;
};

function TreeItem({
  node,
  expandedIds,
  onToggle,
  renderLabel,
  selectedId,
  onSelect,
}: TreeItemProps) {
  const hasChildren = Boolean(node.children?.length);
  const expanded = expandedIds.has(node.id);
  const selected = selectedId !== undefined && selectedId === node.id;

  return (
    <li
      className="tree-item"
      role="treeitem"
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={onSelect ? selected : undefined}
    >
      <div
        className={
          selected ? "tree-item__row tree-item__row--selected" : "tree-item__row"
        }
      >
        {hasChildren ? (
          <button
            type="button"
            className="tree-item__toggle"
            aria-label={expanded ? "Collapse" : "Expand"}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(node.id);
            }}
          >
            {expanded ? (
              <ChevronDown size={18} strokeWidth={2} aria-hidden />
            ) : (
              <ChevronRight size={18} strokeWidth={2} aria-hidden />
            )}
          </button>
        ) : (
          <span className="tree-item__toggle-spacer" aria-hidden />
        )}
        {onSelect ? (
          <button
            type="button"
            className="tree-item__select"
            onClick={() => onSelect(node)}
          >
            <span className="tree-item__label">
              {renderLabel ? renderLabel(node) : node.label}
            </span>
          </button>
        ) : (
          <span className="tree-item__label">
            {renderLabel ? renderLabel(node) : node.label}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <ul className="tree-item__children tree-view" role="group">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              expandedIds={expandedIds}
              onToggle={onToggle}
              renderLabel={renderLabel}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export type TreeViewProps = {
  /** Tree roots; replace with API data when FastAPI is wired. */
  data: TreeNode[];
  /**
   * When omitted: all branch nodes start expanded.
   * When `[]`: all collapsed. Otherwise only these ids render expanded initially.
   */
  defaultExpandedIds?: string[];
  className?: string;
  renderLabel?: (node: TreeNode) => ReactNode;
  /** When set together with `onSelect`, highlights the active row and wires label clicks. */
  selectedId?: string | null;
  onSelect?: (node: TreeNode) => void;
};

export function TreeView({
  data,
  defaultExpandedIds,
  className = "",
  renderLabel,
  selectedId,
  onSelect,
}: TreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() =>
    defaultExpandedIds === undefined
      ? new Set(collectExpandableIds(data))
      : new Set(defaultExpandedIds)
  );

  const onToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const rootClass = useMemo(
    () => ["tree-view", className].filter(Boolean).join(" "),
    [className]
  );

  return (
    <ul className={rootClass} role="tree">
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          expandedIds={expandedIds}
          onToggle={onToggle}
          renderLabel={renderLabel}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
