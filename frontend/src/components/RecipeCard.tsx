import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchRecipeDetail } from "../api";
import type { RecipeDetail as RecipeDetailType } from "../types";

export default function RecipeCard() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RecipeDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchRecipeDetail(id)
      .then((json) => {
        console.log("RecipeDetail JSON:", json);
        setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) return <div className="p-6 text-red-600">Falta el ID de receta.</div>;
  if (loading) return <div className="p-6">Cargando receta…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-6">Sin datos.</div>;

  const img = (data as any).image_url; 

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto p-4 flex items-center gap-3">
          <Link to="/" className="text-sm text-muted-foreground hover:underline">← Volver</Link>
          <h1 className="text-xl font-semibold">Detalle de receta</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <article className="bg-white dark:bg-neutral-900 rounded-2xl shadow p-5 grid md:grid-cols-2 gap-6">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border">
            {img ? (
              <img src={img} alt={data.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">
                Sin imagen
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold">{data.title}</h2>
              <p className="text-muted-foreground mt-1">{data.description}</p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>❤️ {(data as any).likes_count}</div>
              <div>💬 {(data as any).comments_count}</div>
              <div>👀 {(data as any).is_liked_by_me ? "Te gusta" : "No te gusta"}</div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Autor</h3>
              <div className="flex items-center gap-3">
                {data.author.avatar ? (
                  <img
                    src={data.author.avatar}
                    alt={data.author.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted grid place-items-center">👤</div>
                )}
                <span className="font-medium">@{data.author.username}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Ingredientes</h3>
              <ul className="list-disc list-inside space-y-1">
                {data.ingredients.map((ing) => (
                  <li key={ing.id}>
                    <span className="font-medium">{ing.name}</span>
                    {ing.quantity ? ` — ${ing.quantity}` : null}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Pasos</h3>
              <ol className="list-decimal list-inside space-y-1">
                {data.steps
                  .slice()
                  .sort((a, b) => a.position - b.position)
                  .map((s) => (
                    <li key={s.id}>{s.text}</li>
                  ))}
              </ol>
            </div>

            {(data as any).tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {(data as any).tags.map((t: string) => (
                  <span key={t} className="px-2 py-1 text-xs rounded-full border bg-muted">{t}</span>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      </main>
    </div>
  );
}
