from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime
import uuid

class FeedAuthor(BaseModel):
    id: uuid.UUID
    username: str
    profile_picture_url: Optional[HttpUrl] = None

class FeedItem(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    image_url: Optional[HttpUrl] = None
    created_at: datetime
    author: FeedAuthor

    class Config:
        orm_mode = True
