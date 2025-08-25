from pydantic import BaseModel
import uuid
from datetime import datetime

class CommentCreate(BaseModel):
    recipe_id: uuid.UUID
    user_id: uuid.UUID
    content: str

class CommentResponse(BaseModel):
    id: uuid.UUID
    recipe_id: uuid.UUID
    user_id: uuid.UUID
    content: str
    created_at: datetime

    class Config:
        orm_mode = True
