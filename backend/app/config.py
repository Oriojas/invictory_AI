import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
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
    FALLBACK_DATABASE_URL: str = "sqlite:///./invictory.db"

    # AI API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    DEEPSEEK_BASE_URL: str = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")

    # Upload Validation Settings
    MAX_UPLOAD_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_AUDIO_TYPES: List[str] = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/webm", "audio/ogg", "audio/x-m4a", "audio/m4a"]
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

    # Anomaly Detection Settings
    ANOMALY_THRESHOLD_PERCENT: float = float(os.getenv("ANOMALY_THRESHOLD_PERCENT", "50.0"))
    ANOMALY_MIN_ABSOLUTE_DIFF: float = float(os.getenv("ANOMALY_MIN_ABSOLUTE_DIFF", "2.0"))

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

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
