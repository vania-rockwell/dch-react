import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import "./Tabs.scss";

type TabsContextValue = {
  baseId: string;
  selected: string;
  setSelected: (value: string) => void;
  tabIds: readonly string[];
  registerTabList: (ids: string[]) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (ctx === null) {
    throw new Error(`${component} must be used within <Tabs>`);
  }
  return ctx;
}

type TabsProps = {
  children: ReactNode;
  className?: string;
  /** Uncontrolled initial tab. */
  defaultValue: string;
  /** Controlled selected tab id. */
  value?: string;
  onValueChange?: (value: string) => void;
};

export function Tabs({
  children,
  className = "",
  defaultValue,
  value,
  onValueChange,
}: TabsProps) {
  const reactId = useId();
  const baseId = useMemo(() => `tabs-${reactId.replace(/:/g, "")}`, [reactId]);
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const selected = isControlled ? value! : internal;
  const [tabIds, setTabIds] = useState<readonly string[]>([]);

  const setSelected = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternal(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const registerTabList = useCallback((ids: string[]) => {
    setTabIds(ids);
  }, []);

  const ctx = useMemo(
    () => ({
      baseId,
      selected,
      setSelected,
      tabIds,
      registerTabList,
    }),
    [baseId, selected, setSelected, tabIds, registerTabList]
  );

  const rootClass = ["tabs", className].filter(Boolean).join(" ");

  return (
    <TabsContext.Provider value={ctx}>
      <div className={rootClass}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabProps = {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

export function Tab({ value, children, className = "", disabled = false }: TabProps) {
  const { baseId, selected, setSelected } = useTabsContext("Tab");
  const isSelected = selected === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;
  const btnClass = ["tabs__tab", isSelected ? "tabs__tab--selected" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      id={tabId}
      className={btnClass}
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => {
        if (!disabled) setSelected(value);
      }}
    >
      {children}
    </button>
  );
}

type TabPanelProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export function TabPanel({ value, children, className = "" }: TabPanelProps) {
  const { baseId, selected } = useTabsContext("TabPanel");
  const isSelected = selected === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;
  const panelClass = ["tabs__panel", className].filter(Boolean).join(" ");

  return (
    <div
      id={panelId}
      className={panelClass}
      role="tabpanel"
      aria-labelledby={tabId}
      hidden={!isSelected}
    >
      {children}
    </div>
  );
}

type TabListProps = {
  children: ReactNode;
  className?: string;
  "aria-label": string;
};

function collectTabValues(children: ReactNode): string[] {
  const out: string[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const el = child as ReactElement<{ value?: string }>;
    if (el.type === Tab && typeof el.props.value === "string") {
      out.push(el.props.value);
    }
  });
  return out;
}

export function TabList({ children, className = "", "aria-label": ariaLabel }: TabListProps) {
  const { baseId, selected, setSelected, tabIds, registerTabList } = useTabsContext("TabList");
  const tabValues = useMemo(() => collectTabValues(children), [children]);

  useEffect(() => {
    registerTabList(tabValues);
  }, [registerTabList, tabValues]);

  const listClass = ["tabs__list", className].filter(Boolean).join(" ");

  return (
    <div
      className={listClass}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (tabIds.length === 0) return;
        const idx = tabIds.indexOf(selected);
        if (idx < 0) return;

        let nextIdx = idx;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          nextIdx = (idx + 1) % tabIds.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          nextIdx = (idx - 1 + tabIds.length) % tabIds.length;
        } else if (e.key === "Home") {
          e.preventDefault();
          nextIdx = 0;
        } else if (e.key === "End") {
          e.preventDefault();
          nextIdx = tabIds.length - 1;
        } else {
          return;
        }
        const nextValue = tabIds[nextIdx];
        if (nextValue === undefined) return;
        setSelected(nextValue);
        requestAnimationFrame(() => {
          document.getElementById(`${baseId}-tab-${nextValue}`)?.focus();
        });
      }}
    >
      {children}
    </div>
  );
}
