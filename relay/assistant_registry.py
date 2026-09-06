import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class AssistantDefinition:
    assistant_id: str
    name: str
    model: str | None
    max_tokens: int | None
    system_prompt: str


class AssistantRegistry:
    def __init__(self, root: str):
        self.root = Path(root)
        if not self.root.is_absolute():
            self.root = Path(__file__).parent / self.root
        self._assistants = self._load()

    def _load(self) -> dict[str, AssistantDefinition]:
        assistants: dict[str, AssistantDefinition] = {}
        if not self.root.exists():
            return assistants

        for config_path in self.root.glob("*/config.json"):
            data = json.loads(config_path.read_text(encoding="utf-8"))
            assistant_id = data["id"]
            prompt_path = config_path.parent / data.get("prompt", "prompt.md")
            assistants[assistant_id] = AssistantDefinition(
                assistant_id=assistant_id,
                name=data.get("name", assistant_id),
                model=data.get("model"),
                max_tokens=data.get("max_tokens"),
                system_prompt=prompt_path.read_text(encoding="utf-8"),
            )
        return assistants

    def get(self, assistant_id: str) -> AssistantDefinition | None:
        return self._assistants.get(assistant_id)

    @property
    def ids(self) -> list[str]:
        return sorted(self._assistants)
