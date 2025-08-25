from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import users_router, recipes_router, ingredients_router, tags_router, feed_router, likes_router, comments_router

app = FastAPI(title="Recetas API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(recipes_router)
app.include_router(ingredients_router)
app.include_router(tags_router)
app.include_router(feed_router)
app.include_router(likes_router)
app.include_router(comments_router)

@app.get("/")
def root():
    return {"message": "API funcionando 🚀"}
