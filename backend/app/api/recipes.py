from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

from ..db import get_db
from ..models import Recipe
from ..schemas import RecipeCreate, RecipeUpdate, RecipeResponse

router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
def create_recipe(payload: RecipeCreate, db: Session = Depends(get_db)):
    try:
        recipe = Recipe(**payload.dict())
        db.add(recipe)
        db.commit()
        db.refresh(recipe)
        return recipe
    except SQLAlchemyError as e:
        db.rollback()
        msg = str(getattr(e, "orig", e))
        raise HTTPException(status_code=500, detail=f"DB error: {msg}")

@router.get("/", response_model=list[RecipeResponse])
def list_public_recipes(
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    q = db.query(Recipe).filter(Recipe.is_public.is_(True)) \
        .order_by(Recipe.created_at.desc()) \
        .limit(limit).offset(offset)
    return q.all()

@router.get("/user/{user_id}", response_model=list[RecipeResponse])
def list_user_recipes(
    user_id: str,
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    q = db.query(Recipe).filter(Recipe.user_id == user_id) \
        .order_by(Recipe.created_at.desc()) \
        .limit(limit).offset(offset)
    return q.all()

@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: str, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).get(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.patch("/{recipe_id}", response_model=RecipeResponse)
def update_recipe(recipe_id: str, payload: RecipeUpdate, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).get(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(recipe, k, v)
    recipe.updated_at = datetime.utcnow()
    try:
        db.commit()
        db.refresh(recipe)
        return recipe
    except SQLAlchemyError as e:
        db.rollback()
        msg = str(getattr(e, "orig", e))
        raise HTTPException(status_code=500, detail=f"DB error: {msg}")

@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(recipe_id: str, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).get(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    try:
        db.delete(recipe)
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        msg = str(getattr(e, "orig", e))
        raise HTTPException(status_code=500, detail=f"DB error: {msg}")
