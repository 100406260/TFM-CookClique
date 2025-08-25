export type UUID = string;

export type Author = {
  id: UUID;
  username: string;
  avatar: string | null;
};

export type FeedItem = {
  id: UUID;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  author: Author;
  likes_count: number;
  comments_count: number;
  is_liked_by_me: boolean;
};

export type Ingredient = {
  id: UUID;
  name: string;
  quantity: string | null;
};

export type Step = {
  id: UUID;
  position: number;
  text: string;
};

export type Comment = {
  comment_id: UUID;
  content: string;
  created_at: string;
  author: Author;
};

export type RecipeDetail = {
  id: UUID;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  author: Author;
  likes_count: number;
  comments_count: number;
  is_liked_by_me: boolean;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  comments: Comment[];
};

export type FeedResponse = {
  items: FeedItem[];
  total: number;
};
