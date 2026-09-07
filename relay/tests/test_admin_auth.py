import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from admin_auth import new_admin_session, valid_admin_session


class AdminSessionTests(unittest.TestCase):
    def test_signed_session_is_valid(self):
        secret = "a" * 32
        session, max_age = new_admin_session(secret, 12)

        self.assertEqual(max_age, 43200)
        self.assertTrue(valid_admin_session(session, secret))

    def test_tampered_session_is_rejected(self):
        session, _ = new_admin_session("a" * 32, 12)

        self.assertFalse(valid_admin_session(session + "0", "a" * 32))
        self.assertFalse(valid_admin_session(session, "b" * 32))

    def test_expired_session_is_rejected(self):
        session, max_age = new_admin_session("a" * 32, 12)
        expires_at = int(session.split(".", 1)[0])

        self.assertFalse(valid_admin_session(session, "a" * 32, expires_at + max_age))


if __name__ == "__main__":
    unittest.main()
