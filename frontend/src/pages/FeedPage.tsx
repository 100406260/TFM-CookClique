// src/pages/FeedPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FeedItem, FeedResponse } from "../types";

export default function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        "http://127.0.0.1:8000/feed/11111111-1111-1111-1111-111111111111?limit=12&offset=0"
      )
      const data: FeedResponse | FeedItem[] = await res.json();
      setItems(Array.isArray(data) ? data : data.items);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Feed</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((r) => (
          <RecipeCard key={r.id} item={r} />
        ))}
      </div>
    </div>
  );
}

function RecipeCard({ item }: { item: FeedItem }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg transition-shadow">
      <Link to={`/recipe/${item.id}`} className="block">
        <div className="relative w-full aspect-square bg-gray-100">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
            {item.author.avatar && (
              <img
                src={item.author.avatar}
                alt={item.author.username}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <span className="text-sm text-gray-600">@{item.author.username}</span>
        </div>

        <Link to={`/recipe/${item.id}`} className="block">
          <h2 className="font-semibold line-clamp-1">{item.title}</h2>
          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          )}
        </Link>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>❤️ {item.likes_count}</span>
          <span>💬 {item.comments_count}</span>
        </div>
      </div>
    </article>
  );
}
