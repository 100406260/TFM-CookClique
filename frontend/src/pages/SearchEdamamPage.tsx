import { useState } from "react";

type EdamamRecipe = {
  id: string;
  label: string;
  image?: string;
  source?: string;
  url?: string;
};

export default function SearchEdamamPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<EdamamRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function search() {
    setLoading(true);
    setErr(null);
    try {
      // TODO: cambia por tu endpoint backend, ej: /edamam/search?q=...
      const r = await fetch(`http://127.0.0.1:8000/edamam/search?q=${encodeURIComponent(q)}`);
      const data = await r.json();
      setResults(data.hits ?? data.results ?? []);
    } catch {
      setErr("No se pudo consultar Edamam");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca en Edamam (ej. pasta, chicken, vegan)…"
            className="flex-1 rounded-xl border px-3 py-2 outline-none focus:ring"
          />
          <button
            onClick={search}
            className="rounded-xl bg-gray-900 px-4 py-2 text-white"
          >
            Buscar
          </button>
        </div>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading &&
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-gray-200" />
              <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        {!loading &&
          results.map((r, i) => (
            <a
              key={(r as any).id ?? i}
              href={(r as any).url}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full bg-gray-100">
                {(r as any).image && (
                  <img
                    src={(r as any).image}
                    alt={(r as any).label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="p-4">
                <div className="line-clamp-1 text-base font-semibold">
                  {(r as any).label}
                </div>
                <div className="text-xs text-gray-500">
                  {(r as any).source}
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}
