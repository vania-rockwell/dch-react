import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button/Button";
import PageSection from "../../components/PageSection/PageSection";
import Table from "../../components/Table/Table";
import { Tab, TabList, TabPanel, Tabs } from "../../components/Tabs/Tabs";
import { TreeView } from "../../components/Tree/TreeView";
import { formatTreeNodeValue } from "../../components/Tree/formatTreeNodeValue";
import type { TreeNode } from "../../components/Tree/types";
import { fetchParameterTree } from "../../services/parametersTreeService";
import "./ParametersPage.scss";

const TAB = {
  general: "general",
  connectivity: "connectivity",
  parameters: "parameters",
  applications: "applications",
  deployment: "deployment",
} as const;

function ParametersDetailPanel({ node, emptyLabel }: { node: TreeNode | null; emptyLabel: string }) {
  const { t } = useTranslation("pages");

  const connectivityColumns = useMemo(
    () =>
      [
        { key: "id" as const, header: t("parameters.connectivityColId") },
        { key: "endpoint" as const, header: t("parameters.connectivityColEndpoint") },
        { key: "status" as const, header: t("parameters.connectivityColStatus") },
      ] as const,
    [t]
  );

  const connectivityRows: Record<string, unknown>[] = useMemo(
    () => [
      {
        id: "primary",
        endpoint: "https://gateway.internal.example/api",
        status: t("parameters.connectivityStatusOk"),
      },
      {
        id: "fallback",
        endpoint: "https://gateway-dr.internal.example/api",
        status: t("parameters.connectivityStatusStandby"),
      },
    ],
    [t]
  );

  const hasNode = node !== null;
  const childCount = node?.children?.length ?? 0;
  const hasChildren = childCount > 0;
  const hasValue =
    hasNode && node.value !== undefined && node.value !== null;

  return (
    <Tabs
      key={node?.id ?? "__none__"}
      defaultValue={TAB.general}
      className="parameters-detail-tabs"
    >
      <TabList aria-label={t("parameters.detailTabsLabel")}>
        <Tab value={TAB.general}>{t("parameters.tabs.general")}</Tab>
        <Tab value={TAB.connectivity}>{t("parameters.tabs.connectivity")}</Tab>
        <Tab value={TAB.parameters}>{t("parameters.tabs.parameters")}</Tab>
        <Tab value={TAB.applications}>{t("parameters.tabs.applications")}</Tab>
        <Tab value={TAB.deployment}>{t("parameters.tabs.deployment")}</Tab>
      </TabList>

      <TabPanel value={TAB.general}>
        {hasNode ? (
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
        ) : (
          <p className="parameters-detail__placeholder">{emptyLabel}</p>
        )}
      </TabPanel>

      <TabPanel value={TAB.connectivity}>
        <p className="parameters-detail__tab-lead">{t("parameters.tabConnectivityLead")}</p>
        <Table
          columns={[...connectivityColumns]}
          rows={connectivityRows}
          rowKey="id"
          emptyLabel={t("parameters.tabTableEmpty")}
        />
      </TabPanel>

      <TabPanel value={TAB.parameters}>
        {!hasNode ? (
          <p className="parameters-detail__tab-muted">{emptyLabel}</p>
        ) : hasChildren ? (
          <div className="parameters-detail__nested-tree">
            <TreeView key={node.id} data={node.children!} defaultExpandedIds={[]} />
          </div>
        ) : (
          <p className="parameters-detail__tab-muted">{t("parameters.tabParametersEmpty")}</p>
        )}
      </TabPanel>

      <TabPanel value={TAB.applications}>
        {!hasNode ? (
          <p className="parameters-detail__tab-muted">{emptyLabel}</p>
        ) : (
          <form className="parameters-detail-form" onSubmit={(e) => e.preventDefault()}>
            <p className="parameters-detail__tab-lead">{t("parameters.tabApplicationsLead")}</p>
            <label className="parameters-detail-form__field">
              <span className="parameters-detail-form__label">{t("parameters.detailFormAppName")}</span>
              <input
                className="parameters-detail-form__input"
                type="text"
                defaultValue={node.label}
                readOnly
                aria-readonly="true"
              />
            </label>
            <label className="parameters-detail-form__field">
              <span className="parameters-detail-form__label">{t("parameters.detailFormAppVersion")}</span>
              <input
                className="parameters-detail-form__input"
                type="text"
                defaultValue="1.0.0"
                readOnly
                aria-readonly="true"
              />
            </label>
            <div className="parameters-detail-form__actions">
              <Button type="submit" variant="secondary" disabled>
                {t("parameters.detailFormSave")}
              </Button>
            </div>
          </form>
        )}
      </TabPanel>

      <TabPanel value={TAB.deployment}>
        <p className="parameters-detail__tab-lead">{t("parameters.tabDeploymentLead")}</p>
        <ul className="parameters-detail__deployment-list">
          <li>{t("parameters.tabDeploymentItem1")}</li>
          <li>{t("parameters.tabDeploymentItem2")}</li>
          <li>{t("parameters.tabDeploymentItem3")}</li>
        </ul>
      </TabPanel>
    </Tabs>
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
