import math
import re
from dataclasses import dataclass


@dataclass(frozen=True)
class KnowledgeChunk:
    title: str
    content: str


def split_markdown(text: str) -> list[KnowledgeChunk]:
    chunks: list[KnowledgeChunk] = []
    title = "General"
    body: list[str] = []

    for line in text.splitlines():
        if line.startswith("## "):
            if body:
                chunks.append(KnowledgeChunk(title, "\n".join(body).strip()))
            title = line[3:].strip()
            body = []
        else:
            body.append(line)
    if body:
        chunks.append(KnowledgeChunk(title, "\n".join(body).strip()))
    return [chunk for chunk in chunks if chunk.content]


def _tokens(text: str) -> set[str]:
    lowered = text.lower()
    latin = set(re.findall(r"[a-z0-9][a-z0-9_+-]{1,}", lowered))
    chinese_runs = re.findall(r"[\u3400-\u9fff]+", lowered)
    chinese = {
        run[index:index + 2]
        for run in chinese_runs
        for index in range(max(1, len(run) - 1))
    }
    return latin | chinese


def retrieve(query: str, chunks: tuple[KnowledgeChunk, ...], limit: int) -> list[KnowledgeChunk]:
    query_tokens = _tokens(query)
    if not query_tokens or not chunks:
        return []

    document_tokens = [_tokens(f"{chunk.title}\n{chunk.content}") for chunk in chunks]
    frequencies = {
        token: sum(token in tokens for tokens in document_tokens)
        for token in query_tokens
    }
    scored: list[tuple[float, KnowledgeChunk]] = []
    for chunk, tokens in zip(chunks, document_tokens):
        overlap = query_tokens & tokens
        if not overlap:
            continue
        score = sum(math.log((len(chunks) + 1) / (frequencies[token] + 0.5)) for token in overlap)
        title_tokens = _tokens(chunk.title)
        score += 2.0 * len(query_tokens & title_tokens)
        scored.append((score, chunk))

    scored.sort(key=lambda item: item[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]
