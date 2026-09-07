import hashlib
import hmac
import time
import uuid


def new_admin_session(secret: str, session_hours: int) -> tuple[str, int]:
    max_age = session_hours * 3600
    expires_at = int(time.time()) + max_age
    value = f"{expires_at}.{uuid.uuid4().hex}"
    signature = hmac.new(secret.encode("utf-8"), value.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{value}.{signature}", max_age


def valid_admin_session(value: str | None, secret: str, now: int | None = None) -> bool:
    if not value or not secret:
        return False
    try:
        expires, nonce, supplied_signature = value.split(".", 2)
        if int(expires) <= (int(time.time()) if now is None else now) or len(nonce) != 32:
            return False
    except (ValueError, TypeError):
        return False
    signed_value = f"{expires}.{nonce}"
    expected_signature = hmac.new(
        secret.encode("utf-8"), signed_value.encode("utf-8"), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(supplied_signature, expected_signature)
