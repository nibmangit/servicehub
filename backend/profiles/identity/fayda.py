from dataclasses import dataclass
from uuid import uuid4


@dataclass
class IdentityVerificationResult:
    success: bool
    reference: str | None = None
    message: str | None = None


class FaydaClient:
    """
    Mock Fayda client.

    I'll replace this class with the real Fayda API implementation later.
    """

    def verify_identity(self, user):
        """
        Simulate a successful Fayda verification.
        """

        return IdentityVerificationResult(
            success=True,
            reference=str(uuid4()),
            message="Identity verified successfully."
        )