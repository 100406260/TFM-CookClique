// src/pages/RecipePage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import type { RecipeDetail } from "../types";

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErr("Falta el parámetro :id en la URL");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(
          `${API_BASE_URL}/recipes/${id}/detail?viewer_id=11111111-1111-1111-1111-111111111111`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: RecipeDetail = await res.json();
        setData(json);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Error desconocido";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl">Cargando…</div>;
  if (err) return <div className="mx-auto max-w-3xl text-red-700">Error: {err}</div>;
  if (!data) return null;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {/* encabezado, imagen, ingredientes, pasos, tags y comentarios… */}
    </article>
  );
}
