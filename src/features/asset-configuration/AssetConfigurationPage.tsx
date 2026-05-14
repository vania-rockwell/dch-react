import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button/Button";
import PageSection from "../../components/PageSection/PageSection";
import Table from "../../components/Table/Table";
import { Tab, TabList, TabPanel, Tabs } from "../../components/Tabs/Tabs";
import { TreeView } from "../../components/Tree/TreeView";
import { formatTreeNodeValue } from "../../components/Tree/formatTreeNodeValue";
import type { TreeNode } from "../../components/Tree/types";
import { fetchAssetConfigurationTree } from "../../services/assetConfigurationTreeService";
import "./AssetConfigurationPage.scss";

const TAB = {
  general: "general",
  connectivity: "connectivity",
  parameters: "parameters",
  applications: "applications",
  deployment: "deployment",
} as const;

function AssetConfigurationDetailPanel({ node, emptyLabel }: { node: TreeNode | null; emptyLabel: string }) {
  const { t } = useTranslation("pages");

  const connectivityColumns = useMemo(
    () =>
      [
        { key: "id" as const, header: t("assetConfiguration.connectivityColId") },
        { key: "endpoint" as const, header: t("assetConfiguration.connectivityColEndpoint") },
        { key: "status" as const, header: t("assetConfiguration.connectivityColStatus") },
      ] as const,
    [t]
  );

  const connectivityRows: Record<string, unknown>[] = useMemo(
    () => [
      {
        id: "primary",
        endpoint: "https://gateway.internal.example/api",
        status: t("assetConfiguration.connectivityStatusOk"),
      },
      {
        id: "fallback",
        endpoint: "https://gateway-dr.internal.example/api",
        status: t("assetConfiguration.connectivityStatusStandby"),
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
      className="asset-configuration-detail-tabs"
    >
      <TabList aria-label={t("assetConfiguration.detailTabsLabel")}>
        <Tab value={TAB.general}>{t("assetConfiguration.tabs.general")}</Tab>
        <Tab value={TAB.connectivity}>{t("assetConfiguration.tabs.connectivity")}</Tab>
        <Tab value={TAB.parameters}>{t("assetConfiguration.tabs.parameters")}</Tab>
        <Tab value={TAB.applications}>{t("assetConfiguration.tabs.applications")}</Tab>
        <Tab value={TAB.deployment}>{t("assetConfiguration.tabs.deployment")}</Tab>
      </TabList>

      <TabPanel value={TAB.general}>
        {hasNode ? (
          <>
            <h2 className="asset-configuration-detail__heading">{node.label}</h2>
            <dl className="asset-configuration-detail__dl">
              <dt>{t("assetConfiguration.fieldId")}</dt>
              <dd className="asset-configuration-detail__code">{node.id}</dd>
              {hasValue ? (
                <>
                  <dt>{t("assetConfiguration.fieldValue")}</dt>
                  <dd>{formatTreeNodeValue(node.value)}</dd>
                </>
              ) : null}
              {hasChildren ? (
                <>
                  <dt>{t("assetConfiguration.fieldSubitems")}</dt>
                  <dd>{childCount}</dd>
                </>
              ) : null}
            </dl>
          </>
        ) : (
          <p className="asset-configuration-detail__placeholder">{emptyLabel}</p>
        )}
      </TabPanel>

      <TabPanel value={TAB.connectivity}>
        <p className="asset-configuration-detail__tab-lead">{t("assetConfiguration.tabConnectivityLead")}</p>
        <Table
          columns={[...connectivityColumns]}
          rows={connectivityRows}
          rowKey="id"
          emptyLabel={t("assetConfiguration.tabTableEmpty")}
        />
      </TabPanel>

      <TabPanel value={TAB.parameters}>
        {!hasNode ? (
          <p className="asset-configuration-detail__tab-muted">{emptyLabel}</p>
        ) : hasChildren ? (
          <div className="asset-configuration-detail__nested-tree">
            <TreeView key={node.id} data={node.children!} defaultExpandedIds={[]} />
          </div>
        ) : (
          <p className="asset-configuration-detail__tab-muted">{t("assetConfiguration.tabAssetConfigurationEmpty")}</p>
        )}
      </TabPanel>

      <TabPanel value={TAB.applications}>
        {!hasNode ? (
          <p className="asset-configuration-detail__tab-muted">{emptyLabel}</p>
        ) : (
          <form className="asset-configuration-detail-form" onSubmit={(e) => e.preventDefault()}>
            <p className="asset-configuration-detail__tab-lead">{t("assetConfiguration.tabApplicationsLead")}</p>
            <label className="asset-configuration-detail-form__field">
              <span className="asset-configuration-detail-form__label">{t("assetConfiguration.detailFormAppName")}</span>
              <input
                className="asset-configuration-detail-form__input"
                type="text"
                defaultValue={node.label}
                readOnly
                aria-readonly="true"
              />
            </label>
            <label className="asset-configuration-detail-form__field">
              <span className="asset-configuration-detail-form__label">{t("assetConfiguration.detailFormAppVersion")}</span>
              <input
                className="asset-configuration-detail-form__input"
                type="text"
                defaultValue="1.0.0"
                readOnly
                aria-readonly="true"
              />
            </label>
            <div className="asset-configuration-detail-form__actions">
              <Button type="submit" variant="secondary" disabled>
                {t("assetConfiguration.detailFormSave")}
              </Button>
            </div>
          </form>
        )}
      </TabPanel>

      <TabPanel value={TAB.deployment}>
        <p className="asset-configuration-detail__tab-lead">{t("assetConfiguration.tabDeploymentLead")}</p>
        <ul className="asset-configuration-detail__deployment-list">
          <li>{t("assetConfiguration.tabDeploymentItem1")}</li>
          <li>{t("assetConfiguration.tabDeploymentItem2")}</li>
          <li>{t("assetConfiguration.tabDeploymentItem3")}</li>
        </ul>
      </TabPanel>
    </Tabs>
  );
}

export default function AssetConfigurationPage() {
  const { t } = useTranslation("pages");
  const [nodes, setNodes] = useState<TreeNode[] | undefined>();
  const [loadError, setLoadError] = useState<string | undefined>();
  const [selected, setSelected] = useState<TreeNode | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    fetchAssetConfigurationTree({ signal: ac.signal })
      .then((data) => {
        if (!cancelled) setNodes(data);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : t("assetConfiguration.loadError");
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
    <PageSection title={t("assetConfiguration.title")}>
      <div className="asset-configuration-page">
        {loadError !== undefined ? (
          <p role="alert">{loadError}</p>
        ) : nodes === undefined ? (
          <p aria-live="polite">{t("assetConfiguration.loading")}</p>
        ) : (
          <div className="asset-configuration-explorer">
            <aside className="asset-configuration-explorer__tree" aria-label={t("assetConfiguration.title")}>
              <TreeView
                data={nodes}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
              />
            </aside>
            <section
              className="asset-configuration-explorer__detail"
              aria-label={t("assetConfiguration.detailPanel")}
            >
              <AssetConfigurationDetailPanel
                node={selected}
                emptyLabel={t("assetConfiguration.detailPlaceholder")}
              />
            </section>
          </div>
        )}
      </div>
    </PageSection>
  );
}
