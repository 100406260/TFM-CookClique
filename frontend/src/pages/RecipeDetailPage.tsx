// src/pages/RecipePage.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
          `http://127.0.0.1:8000/recipes/${id}/detail?viewer_id=11111111-1111-1111-1111-111111111111`
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log("entra en recipe detail page");
        const json: RecipeDetail = await res.json();
        setData(json);
      } catch (e: any) {
        setErr(e?.message ?? "Error desconocido");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl">Cargando…</div>;
  if (err) return <div className="mx-auto max-w-3xl text-red-700">Error: {err}</div>;
  if (!data) return null;

return (
  <article className="mx-auto max-w-3xl space-y-6 p-4">
    {/* Encabezado */}
    <header className="space-y-2">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="text-muted-foreground">{data.description}</p>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {data.author?.avatar ? (
          <img
            src={data.author.avatar}
            alt={data.author.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted grid place-items-center">👤</div>
        )}
        <span>@{data.author?.username}</span>
      </div>
    </header>

    {/* Imagen principal */}
    {data.image_url! && (
      <div className="w-full overflow-hidden rounded-xl border">
        <img
          src={data.image_url}
          alt={data.title}
          className="w-full h-auto object-cover"
        />
      </div>
    )}

    {/* Ingredientes */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Ingredientes</h2>
      <ul className="list-disc list-inside space-y-1">
        {data.ingredients.map((ing) => (
          <li key={ing.id}>
            <span className="font-medium">{ing.name}</span>
            {ing.quantity ? ` — ${ing.quantity} ${ing.unit}` : null}
          </li>
        ))}
      </ul>
    </section>

    {/* Pasos 
    <section>
      <h2 className="text-xl font-semibold mb-2">Pasos</h2>
      <ol className="list-decimal list-inside space-y-1">
        {data.steps
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((s) => (
            <li key={s.id}>{s.text}</li>
          ))}
      </ol>
    </section>*/}

    {/* Tags */}
    {data.tags?.length > 0 && (
      <section>
        <h2 className="text-xl font-semibold mb-2">Etiquetas</h2>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((t: string) => (
            <span
              key={t}
              className="px-2 py-1 text-xs rounded-full border bg-muted"
            >
              #{t}
            </span>
          ))}
        </div>
      </section>
    )}

    {/* Comentarios */}
    <section>
      <h2 className="text-xl font-semibold mb-2">Comentarios</h2>
      <div className="space-y-3">
        {data.comments && data.comments.length > 0 ? (
          data.comments.map((c) => (
            <div key={c.comment_id} className="border rounded-lg p-3">
              <p className="text-sm font-medium">@{c.author.username}</p>
              <p className="text-sm text-muted-foreground">{c.content}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay comentarios todavía.
          </p>
        )}
      </div>
    </section>
  </article>
);

}
