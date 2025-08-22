from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, union_all
from ..db import get_db
from ..models import Recipe, User, Follow
from ..schemas import FeedItem, FeedAuthor

router = APIRouter(prefix="/feed", tags=["feed"])

@router.get("/{user_id}", response_model=list[FeedItem])
def get_feed(
    user_id: str,
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    followed_q = select(Follow.followed_id).where(Follow.follower_id == user_id)

    ids_subq = union_all(
        followed_q,
        select(User.id).where(User.id == user_id)
    ).subquery()

    U = aliased(User)
    # recetas públicas de seguidos + propias
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
        )
        .join(U, U.id == Recipe.user_id)
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
            )
        ))
    return feed
