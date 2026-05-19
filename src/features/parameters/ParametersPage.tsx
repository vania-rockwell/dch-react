import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/Button/Button";
import Badge from "@/components/Badge/Badge";
import type { TableColumn } from "@/components/Table/Table";
import Table from "@/components/Table/Table";
import PageSection from "@/components/PageSection/PageSection";
import { fetchParametersTable, type ParameterTableRow } from "@/services/parametersService";
import i18n from "@/locales/i18n";
import "./ParametersPage.scss";

export default function ParametersPage() {
  const { t } = useTranslation("pages");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ParameterTableRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setLoadError(null);

    void fetchParametersTable({ signal: controller.signal })
      .then((responseRows) => {
        setRows(responseRows);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setLoadError(t("parameters.loadError"));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [t]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (normalizedSearch.length === 0) {
      return rows;
    }

    const locale = (i18n.resolvedLanguage ?? i18n.language ?? "en").split("-")[0];

    return rows.filter((row) => {
      const localeName =
        row.translationName.find((entry) => entry.locale === locale)?.value ??
        row.translationName[0]?.value ??
        row.parameterName;
      const domainLabels = row.capabilityDomains.map((d) => d.label).join(" ");
      const searchable = `${domainLabels} ${localeName} ${row.dataType}`.toLowerCase();
      return searchable.includes(normalizedSearch);
    });
  }, [search, rows]);

  const columns: TableColumn<ParameterTableRow>[] = [
    {
      key: "parameterName",
      header: t("parameters.table.headers.parameterName"),
    },
    {
      key: "translationName",
      header: t("common:fields.name"),
      render: (value) => {
        const locale = (i18n.resolvedLanguage ?? i18n.language ?? "en").split("-")[0];
        const names = value as ParameterTableRow["translationName"];
        return (
          names.find((entry) => entry.locale === locale)?.value ??
          names[0]?.value ??
          ""
        );
      },
    },
    {
      key: "dataType",
      header: t("parameters.table.headers.dataType"),
    },
    {
      key: "capabilityDomains",
      header: t("parameters.table.headers.capabilityDomain"),
      render: (value) => {
        const domains = value as ParameterTableRow["capabilityDomains"];
        return (
          <div className="parameters-page__context-badges">
            {domains.map((domain, index) => (
              <Badge key={`${domain.label}-${domain.color}-${index}`} color={domain.color}>
                {domain.label}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: "id",
      header: t("common:actions.actions"),
      align: "center",
      render: (_value, row) => (
        <div className="parameters-page__actions-cell">
          <Button
            variant="secondary"
            size="sm"
            icon={Pencil}
            onClick={() => navigate(`/parameters/${row.id}/edit`)}
          />
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => navigate(`/parameters/${row.id}/delete`)}
          />
        </div>
      ),
    },
  ];

  return (
    <PageSection
      title={t("parameters.title")}
      description={t("parameters.description")}
    >
      <div className="parameters-page">
        <div className="parameters-page__toolbar">
          <input
            type="search"
            className="parameters-page__search"
            placeholder={t("common:actions.search")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label={t("parameters.searchAria")}
          />

          <Button variant="secondary" size="sm" onClick={() => navigate("/parameters/new")} icon={Plus}>
            {t("common:actions.add")}
          </Button>
        </div>

        <Table
          columns={columns}
          rows={filteredRows}
          rowKey="id"
          emptyLabel={t("parameters.table.empty")}
        />

        {isLoading && <p className="parameters-page__state">{t("parameters.loading")}</p>}
        {loadError !== null && !isLoading && (
          <p className="parameters-page__state parameters-page__state--error">{loadError}</p>
        )}
      </div>
    </PageSection>
  );
}
