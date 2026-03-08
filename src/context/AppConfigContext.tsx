import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AppConfig, DEFAULT_CONFIG } from "@/lib/types";

interface AppConfigContextType {
  config: AppConfig;
  updateConfig: (partial: Partial<AppConfig>) => void;
  updateBody: (partial: Partial<AppConfig["body"]>) => void;
  updateHeadings: (partial: Partial<AppConfig["headings"]>) => void;
  updateResponsive: (partial: Partial<AppConfig["responsive"]>) => void;
  resetConfig: () => void;
}

const AppConfigContext = createContext<AppConfigContextType | null>(null);

const STORAGE_KEY = "type-scale-config";

function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_CONFIG;
}

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(loadConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // apply theme
    document.documentElement.classList.toggle("dark", config.theme === "dark");
  }, [config]);

  const updateConfig = useCallback(
    (partial: Partial<AppConfig>) => setConfig((prev) => ({ ...prev, ...partial })),
    []
  );
  const updateBody = useCallback(
    (partial: Partial<AppConfig["body"]>) =>
      setConfig((prev) => ({ ...prev, body: { ...prev.body, ...partial } })),
    []
  );
  const updateHeadings = useCallback(
    (partial: Partial<AppConfig["headings"]>) =>
      setConfig((prev) => ({ ...prev, headings: { ...prev.headings, ...partial } })),
    []
  );
  const updateResponsive = useCallback(
    (partial: Partial<AppConfig["responsive"]>) =>
      setConfig((prev) => ({ ...prev, responsive: { ...prev.responsive, ...partial } })),
    []
  );
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AppConfigContext.Provider value={{ config, updateConfig, updateBody, updateHeadings, updateResponsive, resetConfig }}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const ctx = useContext(AppConfigContext);
  if (!ctx) throw new Error("useAppConfig must be used within AppConfigProvider");
  return ctx;
}
