from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..db import get_db
from ..models import Ingredient
from ..schemas import IngredientCreate, IngredientResponse

router = APIRouter(prefix="/ingredients", tags=["ingredients"])

@router.post("/", response_model=IngredientResponse, status_code=status.HTTP_201_CREATED)
def add_ingredient(payload: IngredientCreate, db: Session = Depends(get_db)):
    ing = Ingredient(**payload.dict())
    try:
        db.add(ing); db.commit(); db.refresh(ing)
        return ing
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(500, detail=f"DB error: {getattr(e,'orig',e)}")

@router.get("/by-recipe/{recipe_id}", response_model=list[IngredientResponse])
def list_by_recipe(recipe_id: str, db: Session = Depends(get_db)):
    return db.query(Ingredient).filter(Ingredient.recipe_id == recipe_id).all()

@router.delete("/{ingredient_id}", status_code=204)
def delete_ingredient(ingredient_id: str, db: Session = Depends(get_db)):
    ing = db.get(Ingredient, ingredient_id)
    if not ing: raise HTTPException(404, "Ingredient not found")
    db.delete(ing); db.commit()
