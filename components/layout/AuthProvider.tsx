"use client"; // shared auth/favorites state + single LoginModal instance

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LoginModal } from "@/components/layout/LoginModal";

const AUTH_KEY = "apex-auth";
const FAV_KEY = "apex-favorites";

type AuthState = {
  loggedIn: boolean;
  phone: string | null;
  favorites: Set<string>;
  openLogin: () => void;
  login: (phone: string) => void;
  logout: () => void;
  isFavorite: (slug: string) => boolean;
  /** Toggle a favourite — gated behind login (opens the modal when logged out). */
  toggleFavorite: (slug: string) => void;
};

const AuthCtx = createContext<AuthState | null>(null);

/**
 * Portfolio demo auth. "Logging in" only sets a local flag + phone so the UI
 * can gate favourites behind a login the way OneClickDrive does. No backend,
 * no network — state is mirrored to localStorage for a believable session.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loginOpen, setLoginOpen] = useState(false);

  // Hydrate from localStorage after mount (keeps SSR markup stable).
  useEffect(() => {
    try {
      const rawAuth = localStorage.getItem(AUTH_KEY);
      if (rawAuth) {
        const parsed = JSON.parse(rawAuth) as { phone?: string };
        setLoggedIn(true);
        setPhone(parsed.phone ?? null);
      }
      const rawFav = localStorage.getItem(FAV_KEY);
      if (rawFav) {
        const arr = JSON.parse(rawFav) as unknown;
        if (Array.isArray(arr)) setFavorites(new Set(arr.filter((x): x is string => typeof x === "string")));
      }
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const persistFav = useCallback((next: Set<string>) => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  }, []);

  const openLogin = useCallback(() => setLoginOpen(true), []);

  const login = useCallback((nextPhone: string) => {
    setLoggedIn(true);
    setPhone(nextPhone);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ phone: nextPhone }));
    } catch {
      /* ignore */
    }
    setLoginOpen(false);
  }, []);

  const logout = useCallback(() => {
    setLoggedIn(false);
    setPhone(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.has(slug), [favorites]);

  const toggleFavorite = useCallback(
    (slug: string) => {
      if (!loggedIn) {
        setLoginOpen(true);
        return;
      }
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(slug)) next.delete(slug);
        else next.add(slug);
        persistFav(next);
        return next;
      });
    },
    [loggedIn, persistFav]
  );

  const value = useMemo<AuthState>(
    () => ({ loggedIn, phone, favorites, openLogin, login, logout, isFavorite, toggleFavorite }),
    [loggedIn, phone, favorites, openLogin, login, logout, isFavorite, toggleFavorite]
  );

  return (
    <AuthCtx.Provider value={value}>
      {children}
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        loggedIn={loggedIn}
        phone={phone}
        onLogin={login}
        onLogout={logout}
      />
    </AuthCtx.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
