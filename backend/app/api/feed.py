# backend/app/api/feed.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, union_all, func, exists
from ..db import get_db
from ..models import Recipe, User, Follow, RecipeLike, RecipeComment
from ..schemas import FeedItem, FeedAuthor

router = APIRouter(prefix="/feed", tags=["feed"])

@router.get("/{user_id}", response_model=list[FeedItem])
def get_feed(
    user_id: str,
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    # seguidos + yo
    followed_q = select(Follow.followed_id).where(Follow.follower_id == user_id)
    ids_subq = union_all(
        followed_q,
        select(User.id).where(User.id == user_id)
    ).subquery()

    U = aliased(User)

    # agregados por receta
    likes_sub = (
        db.query(
            RecipeLike.recipe_id.label("rid"),
            func.count(RecipeLike.user_id).label("likes_count")
        )
        .group_by(RecipeLike.recipe_id)
        .subquery()
    )

    comments_sub = (
        db.query(
            RecipeComment.recipe_id.label("rid"),
            func.count(RecipeComment.id).label("comments_count")
        )
        .group_by(RecipeComment.recipe_id)
        .subquery()
    )

    # EXISTS: ¿lo ha likeado este usuario?
    liked_exists = exists().where(
        (RecipeLike.user_id == user_id) & (RecipeLike.recipe_id == Recipe.id)
    )

    q = (
        db.query(
            Recipe.id,
            Recipe.title,
            Recipe.description,
            Recipe.image_url,
            Recipe.created_at,
            U.id.label("author_id"),
            U.username.label("author_username"),
            U.profile_picture_url.label("author_avatar"),
            func.coalesce(likes_sub.c.likes_count, 0).label("likes_count"),
            func.coalesce(comments_sub.c.comments_count, 0).label("comments_count"),
            liked_exists.label("is_liked_by_me"),  # 👈 sin agregados
        )
        .join(U, U.id == Recipe.user_id)
        .outerjoin(likes_sub, likes_sub.c.rid == Recipe.id)
        .outerjoin(comments_sub, comments_sub.c.rid == Recipe.id)
        .filter(Recipe.is_public.is_(True))
        .filter(Recipe.user_id.in_(select(ids_subq.c.followed_id)))
        .order_by(Recipe.created_at.desc())
        .limit(limit)
        .offset(offset)
    )

    rows = q.all()
    feed: list[FeedItem] = []
    for r in rows:
        feed.append(FeedItem(
            id=r.id,
            title=r.title,
            description=r.description,
            image_url=r.image_url,
            created_at=r.created_at,
            author=FeedAuthor(
                id=r.author_id,
                username=r.author_username,
                profile_picture_url=r.author_avatar
            ),
            likes_count=int(r.likes_count or 0),
            comments_count=int(r.comments_count or 0),
            is_liked_by_me=bool(r.is_liked_by_me),
        ))
    return feed
