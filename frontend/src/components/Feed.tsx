// src/components/Feed.tsx
import { useEffect, useState } from "react";
import api from "../api";
import type { FeedItem } from "../types";
import RecipeCard from "./RecipeCard";

const PAGE_SIZE = 12;

export default function Feed({ defaultUserId }: { defaultUserId: string }) {
  const [userId, setUserId] = useState(defaultUserId);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPage(reset = false) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<FeedItem[]>(`/feed/${userId}`, {
        params: { limit: PAGE_SIZE, offset: reset ? 0 : offset },
      });
      setItems(prev => (reset ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
    } catch (e: any) {
      const msg = e?.response?.data?.detail ?? e.message ?? "Error cargando feed";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  }

  // carga inicial y cuando cambie el userId
  useEffect(() => {
    setOffset(0);
    fetchPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // carga cuando cambie offset (paginación)
  useEffect(() => {
    if (offset === 0) return;
    fetchPage(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold">CookClique · Feed</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Usuario (UUID):</label>
          <input
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono w-[360px] max-w-full"
            value={userId}
            onChange={(e) => setUserId(e.target.value.trim())}
            placeholder="11111111-1111-1111-1111-111111111111"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="text-gray-500">Sin recetas todavía.</div>
      )}

      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {items.map((it) => (
          <RecipeCard key={it.id} />
        ))}
      </div>

      <div className="flex items-center justify-center">
        {hasMore && !loading && items.length > 0 && (
          <button
            onClick={() => setOffset(o => o + PAGE_SIZE)}
            className="mt-6 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Cargar más
          </button>
        )}
      </div>

      {loading && <div className="mt-4 text-gray-500">Cargando…</div>}
    </div>
  );
}
