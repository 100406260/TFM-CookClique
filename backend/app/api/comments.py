from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import RecipeComment
from ..schemas import CommentCreate, CommentResponse

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(payload: CommentCreate, db: Session = Depends(get_db)):
    c = RecipeComment(**payload.dict())
    db.add(c); db.commit(); db.refresh(c)
    return c

@router.get("/by-recipe/{recipe_id}", response_model=list[CommentResponse])
def list_comments(recipe_id: str, db: Session = Depends(get_db)):
    return db.query(RecipeComment).filter(RecipeComment.recipe_id == recipe_id).order_by(RecipeComment.created_at.desc()).all()
