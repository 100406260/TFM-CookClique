from pydantic import BaseModel, HttpUrl, ConfigDict
from typing import Optional, List
from datetime import datetime
import uuid

class AuthorMini(BaseModel):
    id: uuid.UUID
    username: str
    profile_picture_url: Optional[HttpUrl] = None

class IngredientOut(BaseModel):
    id: uuid.UUID
    name: str
    quantity: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class TagOut(BaseModel):
    id: uuid.UUID
    name: str

    model_config = ConfigDict(from_attributes=True)

class RecipeDetail(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    image_url: Optional[HttpUrl] = None
    created_at: datetime
    author: AuthorMini
    ingredients: List[IngredientOut] = []
    tags: List[TagOut] = []
    likes_count: int = 0
    comments_count: int = 0
    is_liked_by_me: bool = False

    model_config = ConfigDict(from_attributes=True)
