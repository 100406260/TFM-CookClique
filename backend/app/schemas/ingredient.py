from pydantic import BaseModel
from typing import Optional
import uuid

class IngredientBase(BaseModel):
    name: str
    quantity: Optional[str] = None
    unit: Optional[str] = None

class IngredientCreate(IngredientBase):
    recipe_id: uuid.UUID

class IngredientResponse(IngredientBase):
    id: uuid.UUID
    recipe_id: uuid.UUID
    class Config:
        orm_mode = True
