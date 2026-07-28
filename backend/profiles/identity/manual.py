from dataclasses import dataclass


@dataclass
class IdentityVerificationResult:
    success: bool
    reference: str | None = None
    message: str |None = None


class ManualVerification:
    """
    Manual verification placeholder.
    """

    def verify_identity(self):
        return IdentityVerificationResult(
            success=False,
            reference=None,
            message="Waiting for manual verification."
        )