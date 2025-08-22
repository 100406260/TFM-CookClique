from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserBase(BaseModel):
    username: str
    email: EmailStr
    profile_picture_url: Optional[str] = None
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True
