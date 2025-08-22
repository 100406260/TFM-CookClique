from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime
import uuid

class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    image_url: Optional[HttpUrl] = None
    is_public: bool = True

class RecipeCreate(RecipeBase):
    user_id: uuid.UUID

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    image_url: Optional[HttpUrl] = None
    is_public: Optional[bool] = None

class RecipeResponse(RecipeBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
