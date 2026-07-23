import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "Invictory_AI API"
    VERSION: str = "1.0.0"
    ENV: str = os.getenv("ENV", "development")
    PORT: int = int(os.getenv("PORT", "8080"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./invictory.db"
    )

    # AI API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    DEEPSEEK_BASE_URL: str = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5180",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5180",
        "https://web.telegram.org"
    ]

    @field_validator("OPENAI_API_KEY", "DEEPSEEK_API_KEY", mode="before")
    @classmethod
    def clean_api_keys(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().strip('"').strip("'")
        return v

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
