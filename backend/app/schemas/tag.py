from pydantic import BaseModel
import uuid

class TagCreate(BaseModel):
    recipe_id: uuid.UUID
    tag_name: str

class TagResponse(TagCreate):
    id: uuid.UUID
    class Config:
        orm_mode = True
