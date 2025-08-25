import axios from "axios";

// Permite configurar la URL de la API a través de VITE_API_URL,
// y usa un valor por defecto para desarrollo local.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({ baseURL: API_BASE_URL });

import type { RecipeDetail } from "./types";
export default api;

// --- comments ---
export async function fetchComments(recipeId: string) {
  const { data } = await api.get(`/comments/by-recipe/${recipeId}`);
  return data as import("./types").Comment[];
}

export async function createComment(recipeId: string, userId: string, content: string) {
  const payload = { recipe_id: recipeId, user_id: userId, content };
  const { data } = await api.post("/comments/", payload);
  return data as import("./types").Comment;
}

export async function fetchRecipeDetail(recipeId: string, viewerId?: string) {
  const { data } = await api.get(`/recipes/${recipeId}/detail`, {
    params: viewerId ? { viewer_id: viewerId } : {},
  });
  return data as RecipeDetail;
}
