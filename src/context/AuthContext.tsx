"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loginDemo, ROLE_DASHBOARDS, type DemoUser } from "@/lib/demo-auth";

interface AuthContextValue {
  user: DemoUser | null;
  loading: boolean;
  login: (username: string, password: string) => { ok: boolean; redirect: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: () => ({ ok: false, redirect: "/" }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("demo_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    const account = loginDemo(username, password);
    if (account) {
      localStorage.setItem("demo_user", JSON.stringify(account));
      setUser(account);
      return { ok: true, redirect: ROLE_DASHBOARDS[account.role] };
    }
    return { ok: false, redirect: "/" };
  };

  const logout = () => {
    localStorage.removeItem("demo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
