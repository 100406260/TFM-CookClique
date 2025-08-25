import { Link } from "react-router-dom";
import type { Author } from "../types";

type Props = {
  item: {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
    author: Author;
    likes_count: number;
    comments_count: number;
    is_liked_by_me: boolean;
  };
};

export default function RecipeCard({ item }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
          {item.author.avatar ? (
            <img
              src={item.author.avatar}
              alt={item.author.username}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <Link
            to={`/profile/${item.author.id}`}
            className="block truncate text-sm font-semibold hover:underline"
          >
            {item.author.username}
          </Link>
          <time className="block text-xs text-gray-500">
            {new Date(item.created_at).toLocaleString()}
          </time>
        </div>
      </div>

      {/* Imagen con ratio fijo */}
      {item.image_url && (
        <Link to={`/recipes/${item.id}`} className="block">
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
            <img
              src={item.image_url}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Link>
      )}

      {/* Body */}
      <div className="space-y-2 p-4">
        <Link
          to={`/recipes/${item.id}`}
          className="line-clamp-1 text-lg font-semibold hover:underline"
        >
          {item.title}
        </Link>
        {item.description && (
          <p className="line-clamp-2 text-sm text-gray-700">
            {item.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
          <span>❤️ {item.likes_count}</span>
          <span>💬 {item.comments_count}</span>
          {item.is_liked_by_me && <span className="text-pink-600">• Te gusta</span>}
        </div>
      </div>
    </article>
  );
}
