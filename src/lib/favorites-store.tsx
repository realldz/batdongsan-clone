"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-store";
import { getFavorites, toggleFavorite as toggleFavoriteApi } from "@/services/interactions";

interface FavoritesState {
  favoriteIds: Set<string>;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesState | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, token } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isAuthenticated) {
        if (!cancelled) setFavoriteIds(new Set());
        return;
      }

      try {
        const data = await getFavorites();
        if (cancelled) return;

        const ids = Array.isArray(data)
          ? data.map((item: { id: string }) => item.id)
          : [];
        if (!cancelled) setFavoriteIds(new Set(ids));
      } catch {
        if (!cancelled) setFavoriteIds(new Set());
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  const isFavorite = useCallback(
    (propertyId: string) => favoriteIds.has(propertyId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (propertyId: string): Promise<boolean> => {
      if (!isAuthenticated) return false;

      try {
        const result = await toggleFavoriteApi(propertyId);
        const nowFavorited = result.favorited ?? !favoriteIds.has(propertyId);

        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (nowFavorited) {
            next.add(propertyId);
          } else {
            next.delete(propertyId);
          }
          return next;
        });

        return nowFavorited;
      } catch {
        return favoriteIds.has(propertyId);
      }
    },
    [isAuthenticated, favoriteIds],
  );

  const value = useMemo<FavoritesState>(
    () => ({ favoriteIds, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesState {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
