"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { DisplayMode } from "@/lib/types";
import { autoDetectMode, getStoredMode, persistMode } from "@/lib/mode";

interface ModeContextValue {
  mode: DisplayMode;
  hasExplicitChoice: boolean;
  setMode: (m: DisplayMode) => void;
}

const ModeContext = createContext<ModeContextValue>({
  mode: "normal",
  hasExplicitChoice: false,
  setMode: () => {},
});

export function ModeProvider({
  initialMode,
  children,
}: {
  initialMode: DisplayMode | null;
  children: ReactNode;
}) {
  const [mode, setModeState] = useState<DisplayMode>(initialMode ?? "normal");
  const [hasExplicitChoice, setExplicit] = useState<boolean>(
    initialMode !== null
  );

  // On mount, hydrate from storage / auto-detect.
  useEffect(() => {
    const stored = getStoredMode();
    if (stored) {
      setModeState(stored);
      setExplicit(true);
    } else if (!initialMode) {
      const detected = autoDetectMode();
      setModeState(detected);
      setExplicit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect mode on document for CSS overrides
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.mode = mode;
    }
  }, [mode]);

  const setMode = (m: DisplayMode) => {
    setModeState(m);
    setExplicit(true);
    persistMode(m);
  };

  return (
    <ModeContext.Provider value={{ mode, hasExplicitChoice, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}

export default ModeProvider;
