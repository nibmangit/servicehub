
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import ServiceRequest

ALLOWED_TRANSITIONS = {
    "PENDING": ["ACCEPTED", "REJECTED"],
    "ACCEPTED": ["IN_PROGRESS"],
    "IN_PROGRESS": ["COMPLETED"],
}

class ServiceRequestService:

    @staticmethod
    def change_status(request_obj, new_status, user, otp_code=None, rejection_reason=None):

        current_status = request_obj.status

        # 1. Prevent same status update
        if new_status == current_status:
            raise ValidationError("Request is already in this status.")

        # 2. Validate allowed transitions
        allowed = ALLOWED_TRANSITIONS.get(current_status, [])
        if new_status not in allowed:
            raise ValidationError(
                f"Invalid transition: {current_status} → {new_status}"
            )
 
        # CUSTOMER RULES 
        if request_obj.customer == user:
            if new_status != "CANCELLED":
                raise ValidationError("Customers can only cancel requests.")

            if current_status in ["COMPLETED", "REJECTED"]:
                raise ValidationError("Cannot cancel finished request.")

            request_obj.status = "CANCELLED"
            request_obj.save()
            return request_obj
 
        # PROVIDER RULES 
        if hasattr(user, "providerprofile") and request_obj.provider == user.providerprofile:

            # REJECT
            if new_status == "REJECTED":
                if not rejection_reason:
                    raise ValidationError("Rejection reason required.")

                request_obj.rejection_reason = rejection_reason

            # IN_PROGRESS (START OTP)
            if new_status == "IN_PROGRESS":
                if otp_code != request_obj.start_otp:
                    raise ValidationError("Invalid start OTP.")

            # COMPLETED (FINAL OTP)
            if new_status == "COMPLETED":
                if otp_code != request_obj.complete_otp:
                    raise ValidationError("Invalid completion OTP.")

                request_obj.completed_at = timezone.now()

            request_obj.status = new_status
            request_obj.save()
            return request_obj

        raise ValidationError("You are not allowed to modify this request.")