import { useEffect, useState } from "react";

export default function SearchLocalPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function search() {
    setLoading(true);
    // Ajusta este endpoint a tu backend de búsqueda local
    fetch(`http://127.0.0.1:8000/recipes/search?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(setResults)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // búsqueda inicial opcional
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca por título, tag o ingrediente…"
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

      <div className="space-y-3">
        {loading && <div className="text-gray-600">Buscando…</div>}
        {!loading && results.length === 0 && (
          <div className="rounded-xl border bg-white p-4 text-gray-600">
            Sin resultados.
          </div>
        )}
        {results.map((r) => (
          <div key={r.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{r.title}</div>
                <div className="text-sm text-gray-600">{r.author?.username}</div>
              </div>
              <a
                href={`/recipes/${r.id}`}
                className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white"
              >
                Ver
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
