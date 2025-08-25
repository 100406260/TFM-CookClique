import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
import type { RecipeDetail } from "./types";
export default api;

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

