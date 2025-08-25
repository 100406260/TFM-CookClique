import { useEffect, useState } from "react";
import type { Comment } from "../types";
import { fetchComments, createComment } from "../api";

type Props = {
  recipeId: string;
  currentUserId: string; // de momento usa el UUID de Alice hasta tener auth
  onNewCount?: (count: number) => void; // para actualizar el contador en la tarjeta
};

export default function CommentList({ recipeId, currentUserId, onNewCount }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComments(recipeId);
      setComments(data);
      onNewCount?.(data.length);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando comentarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setSending(true);
    setError(null);
    try {
      const c = await createComment(recipeId, currentUserId, content);
      setComments(prev => [c, ...prev]);
      onNewCount?.(comments.length + 1);
      setText("");
    } catch (e: any) {
      setError(e?.message ?? "No se pudo enviar el comentario");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-3 border-t pt-3">
      <form onSubmit={submit} className="flex items-start gap-2">
        <textarea
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y min-h-[60px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Escribe un comentario…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
        />
        <button
          className="px-3 h-10 rounded-lg bg-emerald-600 text-white text-sm disabled:opacity-50"
          disabled={sending || !text.trim()}
        >
          {sending ? "Enviando…" : "Comentar"}
        </button>
      </form>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-3 text-gray-500 text-sm">Cargando comentarios…</div>
      ) : comments.length === 0 ? (
        <div className="mt-3 text-gray-500 text-sm">Sé la primera persona en comentar.</div>
      ) : (
        <ul className="mt-3 space-y-3">
          {comments.map((c) => (
            <li key={c.comment_id} className="text-sm">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <span className="font-medium">user:{c.author.username.slice(0,8)}…</span>
                  <span>·</span>
                  <time dateTime={c.created_at}>
                    {new Date(c.created_at).toLocaleString()}
                  </time>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
