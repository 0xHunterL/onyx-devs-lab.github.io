from pydantic_settings import BaseSettings


class RelaySettings(BaseSettings):
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_MODEL: str = "deepseek-v4-flash"
    DEEPSEEK_COMPACTION_MODEL: str = "deepseek-v4-flash"
    DATABASE_URL: str = ""
    VISITOR_HASH_SECRET: str = ""
    LEAD_WEBHOOK_URL: str = ""
    LEAD_WEBHOOK_FORMAT: str = "generic"
    LEAD_WEBHOOK_SECRET: str = ""
    ADMIN_API_TOKEN: str = ""
    WORKBENCH_ORIGIN: str = "https://chat.mimimiai.com"
    WORKBENCH_SESSION_HOURS: int = 12
    RATE_LIMIT_PER_MINUTE: int = 6
    RATE_LIMIT_PER_HOUR: int = 60
    GLOBAL_DAILY_REQUEST_LIMIT: int = 1000
    CORS_ORIGINS: str = "https://onyxdevslab.com,https://www.onyxdevslab.com,https://hk.onyxdevslab.com,https://onyx-devs-lab.github.io"
    MAX_TOKENS: int = 1200
    MAX_MESSAGES: int = 120
    MAX_MESSAGE_CHARS: int = 12000
    MAX_TOTAL_INPUT_CHARS: int = 400000
    CONTEXT_COMPACTION_THRESHOLD_CHARS: int = 180000
    RECENT_MESSAGES_TO_KEEP: int = 16
    RETRIEVAL_CHUNKS: int = 4
    ANONYMOUS_RETENTION_DAYS: int = 30
    ANONYMOUS_ABSOLUTE_RETENTION_DAYS: int = 90
    LEAD_RETENTION_DAYS: int = 365
    ASSISTANTS_DIR: str = "assistants"
    model_config = {"env_file": ".env", "extra": "ignore"}
