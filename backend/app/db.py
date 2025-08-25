import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Cargar variables desde backend/.env aunque uvicorn se ejecute desde otra ruta
ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# Si no se define DATABASE_URL en el entorno, usar una base SQLite local
DATABASE_URL = os.getenv("DATABASE_URL")
CONNECT_ARGS = {}
if not DATABASE_URL:
    db_file = Path(__file__).resolve().parents[1] / "cookclique.db"
    DATABASE_URL = f"sqlite:///{db_file}"
    CONNECT_ARGS = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=CONNECT_ARGS)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
