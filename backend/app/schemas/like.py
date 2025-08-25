from pydantic import BaseModel
import uuid
from datetime import datetime

class LikeToggle(BaseModel):
    user_id: uuid.UUID
    recipe_id: uuid.UUID

class LikeInfo(BaseModel):
    recipe_id: uuid.UUID
    likes_count: int
    is_liked_by_me: bool = False
