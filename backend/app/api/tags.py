from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..db import get_db
from ..models import Tag
from ..schemas import TagCreate, TagResponse

router = APIRouter(prefix="/tags", tags=["tags"])

@router.post("/", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
def add_tag(payload: TagCreate, db: Session = Depends(get_db)):
    tag = Tag(**payload.dict())
    try:
        db.add(tag); db.commit(); db.refresh(tag)
        return tag
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(500, detail=f"DB error: {getattr(e,'orig',e)}")

@router.get("/by-recipe/{recipe_id}", response_model=list[TagResponse])
def list_tags(recipe_id: str, db: Session = Depends(get_db)):
    return db.query(Tag).filter(Tag.recipe_id == recipe_id).all()

@router.delete("/{tag_id}", status_code=204)
def delete_tag(tag_id: str, db: Session = Depends(get_db)):
    tag = db.get(Tag, tag_id)
    if not tag: raise HTTPException(404, "Tag not found")
    db.delete(tag); db.commit()
