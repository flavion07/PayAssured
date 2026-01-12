from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path


class Settings(BaseSettings):
    database_url: str = "sqlite:///payassured.db"
    secret_key: str = "dev-secret-key-change-in-production"
    debug: bool = True
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]

    class Config:
        env_file = str(Path(__file__).parent / ".env")


settings = Settings()
