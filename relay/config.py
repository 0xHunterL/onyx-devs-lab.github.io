from pathlib import Path

from pydantic_settings import BaseSettings

_PROMPT_FILE = Path(__file__).parent / "system_prompt.md"


class RelaySettings(BaseSettings):
    VERTEX_PROJECT_ID: str = "g-alpha-1680510686959"
    VERTEX_REGION: str = "us-east5"
    GOOGLE_APPLICATION_CREDENTIALS: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-4-6"
    API_KEY: str = "onyx-R6RASZDJHcwI3-IgQIGQV8TrXrt3uSNsR1jz670lCMM"
    RATE_LIMIT_PER_MINUTE: int = 10
    CORS_ORIGINS: str = "https://onyxdevslab.com,http://onyxdevslab.com,https://onyx-devs-lab.github.io"
    MAX_TOKENS: int = 4096
    TEMPERATURE: float = 0.7

    model_config = {"env_file": ".env", "extra": "ignore"}

    @property
    def system_prompt(self) -> str:
        return _PROMPT_FILE.read_text(encoding="utf-8")
