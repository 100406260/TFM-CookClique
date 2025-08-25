from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..db import get_db
from ..models import RecipeLike
from ..schemas import LikeToggle, LikeInfo

router = APIRouter(prefix="/likes", tags=["likes"])

@router.post("/toggle", response_model=LikeInfo)
def toggle_like(payload: LikeToggle, db: Session = Depends(get_db)):
    existing = db.query(RecipeLike).filter(
        RecipeLike.user_id == payload.user_id,
        RecipeLike.recipe_id == payload.recipe_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        likes_count = db.query(func.count(RecipeLike.user_id)).filter(RecipeLike.recipe_id == payload.recipe_id).scalar() or 0
        return LikeInfo(recipe_id=payload.recipe_id, likes_count=likes_count, is_liked_by_me=False)

    like = RecipeLike(user_id=payload.user_id, recipe_id=payload.recipe_id)
    db.add(like)
    db.commit()
    likes_count = db.query(func.count(RecipeLike.user_id)).filter(RecipeLike.recipe_id == payload.recipe_id).scalar() or 0
    return LikeInfo(recipe_id=payload.recipe_id, likes_count=likes_count, is_liked_by_me=True)
