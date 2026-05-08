import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageSection from "../../components/PageSection/PageSection";
import { TreeView } from "../../components/Tree/TreeView";
import { formatTreeNodeValue } from "../../components/Tree/formatTreeNodeValue";
import type { TreeNode } from "../../components/Tree/types";
import { fetchParameterTree } from "../../services/parametersTreeService";
import "./ParametersPage.scss";

function ParametersDetailPanel({ node, emptyLabel }: { node: TreeNode | null; emptyLabel: string }) {
  const { t } = useTranslation("pages");

  if (node === null) {
    return <p className="parameters-detail__placeholder">{emptyLabel}</p>;
  }

  const childCount = node.children?.length ?? 0;
  const hasChildren = childCount > 0;
  const hasValue = node.value !== undefined && node.value !== null;

  return (
    <>
      <h2 className="parameters-detail__heading">{node.label}</h2>
      <dl className="parameters-detail__dl">
        <dt>{t("parameters.fieldId")}</dt>
        <dd className="parameters-detail__code">{node.id}</dd>
        {hasValue ? (
          <>
            <dt>{t("parameters.fieldValue")}</dt>
            <dd>{formatTreeNodeValue(node.value)}</dd>
          </>
        ) : null}
        {hasChildren ? (
          <>
            <dt>{t("parameters.fieldSubitems")}</dt>
            <dd>{childCount}</dd>
          </>
        ) : null}
      </dl>
    </>
  );
}

export default function ParametersPage() {
  const { t } = useTranslation("pages");
  const [nodes, setNodes] = useState<TreeNode[] | undefined>();
  const [loadError, setLoadError] = useState<string | undefined>();
  const [selected, setSelected] = useState<TreeNode | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    fetchParameterTree({ signal: ac.signal })
      .then((data) => {
        if (!cancelled) setNodes(data);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : t("parameters.loadError");
        if (!cancelled) {
          setLoadError(message);
          setNodes(undefined);
        }
      });

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [t]);

  return (
    <PageSection title={t("parameters.title")}>
      <div className="parameters-page">
        {loadError !== undefined ? (
          <p role="alert">{loadError}</p>
        ) : nodes === undefined ? (
          <p aria-live="polite">{t("parameters.loading")}</p>
        ) : (
          <div className="parameters-explorer">
            <aside className="parameters-explorer__tree" aria-label={t("parameters.title")}>
              <TreeView
                data={nodes}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
              />
            </aside>
            <section
              className="parameters-explorer__detail"
              aria-label={t("parameters.detailPanel")}
            >
              <ParametersDetailPanel
                node={selected}
                emptyLabel={t("parameters.detailPlaceholder")}
              />
            </section>
          </div>
        )}
      </div>
    </PageSection>
  );
}
