from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, exists
from ..db import get_db
from ..models import Recipe, User, RecipeLike, RecipeComment, Ingredient, Tag
from ..schemas import RecipeDetail, AuthorMini, IngredientOut, TagOut

router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.get("/{recipe_id}/detail", response_model=RecipeDetail)
def recipe_detail(
    recipe_id: str,
    db: Session = Depends(get_db),
    viewer_id: str | None = Query(None, description="UUID del usuario que ve (para saber si likeó)")
):
    # receta + autor
    r = (
        db.query(Recipe, User)
        .join(User, User.id == Recipe.user_id)
        .filter(Recipe.id == recipe_id, Recipe.is_public.is_(True))
        .first()
    )
    if not r:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    recipe, author = r

    # ingredientes (si los tienes en tabla ingredients con recipe_id)
    ing_rows = (
        db.query(Ingredient)
        .filter(Ingredient.recipe_id == recipe.id)
        .order_by(Ingredient.name.asc())
        .all()
    )

    # tags (si tienes una tabla pivot recipe_tags; si no, sáltalo o ajusta)
    try:
        from ..models.recipe_tag import RecipeTag  # si la tuvieras
        tag_rows = (
            db.query(Tag)
            .join(RecipeTag, RecipeTag.tag_id == Tag.id)
            .filter(RecipeTag.recipe_id == recipe.id)
            .order_by(Tag.name.asc())
            .all()
        )
    except Exception:
        tag_rows = []

    likes_count = db.query(func.count(RecipeLike.user_id)).filter(RecipeLike.recipe_id == recipe.id).scalar() or 0
    comments_count = db.query(func.count(RecipeComment.id)).filter(RecipeComment.recipe_id == recipe.id).scalar() or 0

    is_liked_by_me = False
    if viewer_id:
        is_liked_by_me = db.query(
            exists().where((RecipeLike.user_id == viewer_id) & (RecipeLike.recipe_id == recipe.id))
        ).scalar()

    return RecipeDetail(
        id=recipe.id,
        title=recipe.title,
        description=recipe.description,
        image_url=recipe.image_url,
        created_at=recipe.created_at,
        author=AuthorMini(id=author.id, username=author.username, profile_picture_url=author.profile_picture_url),
        ingredients=[IngredientOut(id=i.id, name=i.name, quantity=getattr(i, "quantity", None), unit=getattr(i, "unit", None)) for i in ing_rows],
        tags=[TagOut(id=t.id, name=t.name) for t in tag_rows],
        likes_count=int(likes_count),
        comments_count=int(comments_count),
        is_liked_by_me=bool(is_liked_by_me),
    )
