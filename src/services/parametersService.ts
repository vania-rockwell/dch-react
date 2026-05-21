import sampleParametersTable from "@/assets/data/parametersTable.sample.json";
// import { router } from "@/services/internalRouter";
import type { BadgeColor } from "@/components/Badge/Badge";

const MOCK_LATENCY_MS = 300;
const PARAMETERS_ENDPOINT = "/parameters";

export type ParameterCapabilityDomains = {
  id: string;
  label: string;
  color: BadgeColor;
};

export type ParameterLocaleNames = {
  locale: string;
  value: string;
};

export type ParameterTableRow = {
  id: string;
  parameterName: string;
  translationName: ParameterLocaleNames[];
  dataType: string;
  capabilityDomains: ParameterCapabilityDomains[];
};

export type ParameterUpsertPayload = Omit<ParameterTableRow, "id">;
type ParameterTablePayload = ParameterTableRow[] | { items?: ParameterTableRow[] };

function normalizeParameterRows(raw: unknown): ParameterTableRow[] {
  if (Array.isArray(raw)) {
    return raw as ParameterTableRow[];
  }

  if (
    raw !== null &&
    typeof raw === "object" &&
    "items" in raw &&
    Array.isArray((raw as { items?: unknown }).items)
  ) {
    return (raw as { items: ParameterTableRow[] }).items;
  }

  return [];
}

function waitMockLatency(signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
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

    if (!signal) {
      return;
    }

    if (signal.aborted) {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function getMockRows(): ParameterTableRow[] {
  return normalizeParameterRows(sampleParametersTable);
}

export type FetchParametersTableOptions = {
  signal?: AbortSignal;
};

export type FetchParameterByIdOptions = {
  signal?: AbortSignal;
};

export type ParameterMutationOptions = {
  signal?: AbortSignal;
};

export async function fetchParametersTable(
  options?: FetchParametersTableOptions
): Promise<ParameterTableRow[]> {
  // const response = await router.get<ParameterTablePayload>(PARAMETERS_ENDPOINT, {
  //   signal: options?.signal,
  // });
  // if (response.error) throw new Error(response.error);
  // return normalizeParameterRows(response.data);

  await waitMockLatency(options?.signal);
  return getMockRows();
}

export async function fetchParameterById(
  id: string,
  options?: FetchParameterByIdOptions
): Promise<ParameterTableRow | null> {
  // const response = await router.get<ParameterTableRow>(`${PARAMETERS_ENDPOINT}/${id}`, {
  //   signal: options?.signal,
  // });
  // if (response.error) throw new Error(response.error);
  // return response.data ?? null;

  await waitMockLatency(options?.signal);
  return getMockRows().find((row) => row.id === id) ?? null;
}

export async function createParameter(
  payload: ParameterUpsertPayload,
  options?: ParameterMutationOptions
): Promise<ParameterTableRow> {
  // const response = await router.post<ParameterTableRow>(PARAMETERS_ENDPOINT, payload, {
  //   signal: options?.signal,
  // });
  // if (response.error || !response.data) throw new Error(response.error ?? "Failed to create parameter");
  // return response.data;

  await waitMockLatency(options?.signal);
  return {
    ...payload,
    id: `${payload.parameterName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
  };
}

export async function updateParameter(
  id: string,
  payload: ParameterUpsertPayload,
  options?: ParameterMutationOptions
): Promise<ParameterTableRow> {
  // const response = await router.put<ParameterTableRow>(`${PARAMETERS_ENDPOINT}/${id}`, payload, {
  //   signal: options?.signal,
  // });
  // if (response.error || !response.data) throw new Error(response.error ?? "Failed to update parameter");
  // return response.data;

  await waitMockLatency(options?.signal);
  return { ...payload, id };
}

export async function deleteParameter(
  id: string,
  options?: ParameterMutationOptions
): Promise<void> {
  // const response = await router.delete<void>(`${PARAMETERS_ENDPOINT}/${id}`, {
  //   signal: options?.signal,
  // });
  // if (response.error) throw new Error(response.error);

  await waitMockLatency(options?.signal);
  void id;
}
