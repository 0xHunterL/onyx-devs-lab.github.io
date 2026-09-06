from pydantic_settings import BaseSettings


class RelaySettings(BaseSettings):
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_MODEL: str = "deepseek-chat"
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
