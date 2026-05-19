import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Badge from "../../components/Badge/Badge";
import type { BadgeColor } from "../../components/Badge/Badge";
import { Plus } from "lucide-react";
import { Button } from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import PageSection from "../../components/PageSection/PageSection";
import Select from "../../components/Select/Select";
import Snackbar from "../../components/Snackbar/Snackbar";
import "./ParameterCrudPage.scss";

type ParameterCrudMode = "new" | "edit" | "delete";

type ParameterCrudPageProps = {
  mode: ParameterCrudMode;
};

type DomainOption = {
  id: string;
  label: string;
  color: BadgeColor;
};

const domainOptions: DomainOption[] = [
  { id: "production", label: "Production", color: "primary" },
  { id: "batch", label: "Batch", color: "white" },
  { id: "machine-event", label: "Machine Event", color: "gray" },
  { id: "line-view", label: "Line View", color: "blue" },
  { id: "filler", label: "Filler", color: "indigo" },
  { id: "vials", label: "Vials", color: "purple" },
  { id: "injection", label: "Injection", color: "pink" },
  { id: "transport", label: "Transport", color: "orange" },
  { id: "inspection", label: "Inspection", color: "yellow" },
  { id: "maintenance", label: "Maintenance", color: "teal" },
  { id: "calibration", label: "Calibration", color: "black" },
];

const dataTypeOptions = [
  { value: "boolean", label: "Boolean" },
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
];

export default function ParameterCrudPage({ mode }: ParameterCrudPageProps) {
  const { t } = useTranslation("pages");
  const navigate = useNavigate();

  const [name, setName] = useState(mode === "new" ? "" : "BatchStart");
  const [dataType, setDataType] = useState(mode === "new" ? "boolean" : "boolean");
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    mode === "new" ? ["production"] : ["production", "batch"]
  );
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [draftDomains, setDraftDomains] = useState<string[]>(selectedDomains);
  const [submitSnackbarOpen, setSubmitSnackbarOpen] = useState(false);

  const openDomainModal = () => {
    setDraftDomains(selectedDomains);
    setDomainModalOpen(true);
  };

  const closeDomainModal = () => setDomainModalOpen(false);

  const toggleDraftDomain = (id: string) => {
    setDraftDomains((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const confirmDomains = () => {
    setSelectedDomains(draftDomains);
    setDomainModalOpen(false);
  };

  const title = useMemo(() => {
    if (mode === "new") return t("parameterCrud.newTitle");
    if (mode === "edit") return t("parameterCrud.editTitle");
    return t("parameterCrud.deleteTitle");
  }, [mode, t]);

  const submitLabel = useMemo(() => {
    if (mode === "new") return t("common:actions.add");
    if (mode === "edit") return t("common:actions.save");
    return t("common:actions.delete");
  }, [mode, t]);

  const isDelete = mode === "delete";

  const selectedDomainBadges = useMemo(
    () => domainOptions.filter((option) => selectedDomains.includes(option.id)),
    [selectedDomains]
  );

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();
    setSubmitSnackbarOpen(true);
    window.setTimeout(() => navigate("/parameters"), 3000);
  };

  const submitConfirmationVariant = useMemo(() => {
    if (mode === "delete") return "danger";
    return "success";
  }, [mode]);

  const submitConfirmationMessage = useMemo(() => {
    if (mode === "new") return t("parameterCrud.submitSuccess.create");
    if (mode === "edit") return t("parameterCrud.submitSuccess.save");
    return t("parameterCrud.submitSuccess.delete");
  }, [mode, t]);

  return (
    <PageSection title={title} description={t("parameterCrud.description")}>
      <form className="parameter-crud" onSubmit={handleSubmit}>
        <div className="parameter-crud__field parameter-crud__field--domains">
          <div className="parameter-crud__label-row">
            <span className="parameter-crud__label">{t("parameterCrud.fields.capabilityDomain")}</span>
            {!isDelete && 
              <Button size="sm" variant="secondary" type="button" icon={Plus} onClick={openDomainModal}>
                {t("parameterCrud.addCapabilityDomain")}
              </Button>
            }
          </div>
          <div className="parameter-crud__badges" role="group" aria-label={t("parameterCrud.fields.capabilityDomain")}>
            {selectedDomainBadges.map((option) => (
              <Badge key={option.id} color={option.color}>
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        <label className="parameter-crud__field" htmlFor="parameter-name-input">
          <span className="parameter-crud__label">{t("common:fields.name")}</span>
          <input
            id="parameter-name-input"
            className="parameter-crud__input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isDelete}
            required
          />
        </label>

        <label className="parameter-crud__field" htmlFor="parameter-data-type-select">
          <span className="parameter-crud__label">{t("parameterCrud.fields.dataType")}</span>
          <Select
            id="parameter-data-type-select"
            options={dataTypeOptions}
            value={dataType}
            onChange={(event) => setDataType(event.target.value)}
            size="sm"
            disabled={isDelete}
          />
        </label>

        {isDelete && <p className="parameter-crud__warning">{t("parameterCrud.deleteWarning")}</p>}

        <Modal
          open={domainModalOpen}
          title={t("parameterCrud.fields.capabilityDomain")}
          onClose={closeDomainModal}
          size="md"
          actions={
            <>
              <Button type="button" variant="white" onClick={closeDomainModal}>
                {t("common:actions.cancel")}
              </Button>
              <Button type="button" variant="primary" onClick={confirmDomains}>
                {t("common:actions.confirm")}
              </Button>
            </>
          }
        >
          <div className="parameter-crud__domain-picker">
            {domainOptions.map((option) => {
              const selected = draftDomains.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`parameter-crud__domain-option${selected ? " parameter-crud__domain-option--selected" : ""}`}
                  onClick={() => toggleDraftDomain(option.id)}
                  aria-pressed={selected}
                >
                  <Badge color={option.color}>{option.label}</Badge>
                </button>
              );
            })}
          </div>
        </Modal>

        <div className="parameter-crud__footer">
          <Button type="button" variant="white" onClick={() => navigate("/parameters")}>
            {t("common:actions.cancel")}
          </Button>
          <Button type="submit" variant={isDelete ? "danger" : "primary"}>
            {submitLabel}
          </Button>
        </div>

        <Snackbar
          open={submitSnackbarOpen}
          onClose={() => setSubmitSnackbarOpen(false)}
          variant={submitConfirmationVariant}
          message={submitConfirmationMessage}
          autoHideMs={2500}
        />
      </form>
    </PageSection>
  );
}
