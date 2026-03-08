import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AppConfig, SavedSystem } from "@/lib/types";
import { DEFAULT_CONFIG } from "@/lib/types";
import { loadGoogleFont } from "@/lib/scale-utils";

interface AppConfigContextType {
  config: AppConfig;
  updateConfig: (partial: Partial<AppConfig>) => void;
  updateBody: (partial: Partial<AppConfig["body"]>) => void;
  updateHeadings: (partial: Partial<AppConfig["headings"]>) => void;
  updateResponsive: (partial: Partial<AppConfig["responsive"]>) => void;
  updateCompare: (partial: Partial<AppConfig["compare"]>) => void;
  resetConfig: () => void;
  applyPreset: (config: Partial<AppConfig>) => void;
  savedSystems: SavedSystem[];
  saveSystem: (name: string) => void;
  loadSystem: (id: string) => void;
  deleteSystem: (id: string) => void;
}

const AppConfigContext = createContext<AppConfigContextType | null>(null);

const STORAGE_KEY = "type-scale-config";
const SAVED_SYSTEMS_KEY = "type-scale-saved-systems";

function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        body: { ...DEFAULT_CONFIG.body, ...(parsed.body || {}) },
        headings: { ...DEFAULT_CONFIG.headings, ...(parsed.headings || {}) },
        responsive: { ...DEFAULT_CONFIG.responsive, ...(parsed.responsive || {}) },
        compare: { ...DEFAULT_CONFIG.compare, ...(parsed.compare || {}) },
      };
    }
  } catch {}
  return DEFAULT_CONFIG;
}

function loadSavedSystems(): SavedSystem[] {
  try {
    const raw = localStorage.getItem(SAVED_SYSTEMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(loadConfig);
  const [savedSystems, setSavedSystems] = useState<SavedSystem[]>(loadSavedSystems);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    if (config.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [config]);

  useEffect(() => {
    localStorage.setItem(SAVED_SYSTEMS_KEY, JSON.stringify(savedSystems));
  }, [savedSystems]);

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
  const updateCompare = useCallback(
    (partial: Partial<AppConfig["compare"]>) =>
      setConfig((prev) => ({ ...prev, compare: { ...prev.compare, ...partial } })),
    []
  );
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  const applyPreset = useCallback((preset: Partial<AppConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...preset,
      body: { ...prev.body, ...(preset.body || {}) },
      headings: { ...prev.headings, ...(preset.headings || {}) },
    }));
  }, []);

  const saveSystem = useCallback((name: string) => {
    const { theme, ...rest } = config;
    const system: SavedSystem = {
      id: crypto.randomUUID(),
      name,
      config: rest,
      createdAt: Date.now(),
    };
    setSavedSystems((prev) => [...prev, system]);
  }, [config]);

  const loadSystem = useCallback((id: string) => {
    const system = savedSystems.find((s) => s.id === id);
    if (system) {
      setConfig((prev) => ({ ...prev, ...system.config, body: { ...prev.body, ...system.config.body }, headings: { ...prev.headings, ...system.config.headings } }));
    }
  }, [savedSystems]);

  const deleteSystem = useCallback((id: string) => {
    setSavedSystems((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <AppConfigContext.Provider value={{
      config, updateConfig, updateBody, updateHeadings, updateResponsive,
      updateCompare, resetConfig, applyPreset, savedSystems, saveSystem, loadSystem, deleteSystem,
    }}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const ctx = useContext(AppConfigContext);
  if (!ctx) throw new Error("useAppConfig must be used within AppConfigProvider");
  return ctx;
}
