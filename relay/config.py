from pydantic_settings import BaseSettings


class RelaySettings(BaseSettings):
    VERTEX_PROJECT_ID: str = "g-alpha-1680510686959"
    VERTEX_REGION: str = "us-east5"
    GOOGLE_APPLICATION_CREDENTIALS: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-4-6"
    CLAUDE_FALLBACK_MODELS: str = "claude-haiku-4-5@20251001"
    RATE_LIMIT_PER_MINUTE: int = 6
    RATE_LIMIT_PER_HOUR: int = 60
    GLOBAL_DAILY_REQUEST_LIMIT: int = 1000
    CORS_ORIGINS: str = "https://onyxdevslab.com,https://www.onyxdevslab.com,https://hk.onyxdevslab.com,https://onyx-devs-lab.github.io"
    MAX_TOKENS: int = 1200
    MAX_MESSAGES: int = 20
    MAX_MESSAGE_CHARS: int = 3000
    MAX_TOTAL_INPUT_CHARS: int = 16000
    ASSISTANTS_DIR: str = "assistants"
    model_config = {"env_file": ".env", "extra": "ignore"}
