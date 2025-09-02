from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
import uuid

class UserPublic(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr
    profile_picture_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class RegisterIn(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
