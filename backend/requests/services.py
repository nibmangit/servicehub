
from django.utils import timezone
from django.db.models import F
from rest_framework.exceptions import ValidationError
from .models import ServiceRequest
from notifications.services import NotificationService
from profiles.models import ProviderProfile

ALLOWED_TRANSITIONS = {
    "PENDING": ["ACCEPTED", "REJECTED", "CANCELLED"],
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
            raise ValidationError(f"Invalid transition: {current_status} → {new_status}")
 
        # CUSTOMER RULES 
        if request_obj.customer == user:
            if new_status != "CANCELLED":
                raise ValidationError("Customers can only cancel requests.")

            if current_status in ["COMPLETED", "REJECTED"]:
                raise ValidationError("Cannot cancel finished request.")

            request_obj.status = "CANCELLED"
            request_obj.save()
            NotificationService.notify(
                user=request_obj.provider.user,
                notification_type="REQUEST_CANCELLED",
                title="Request Cancelled",
                message=f"{user.email} cancelled the request",
                request=request_obj
            )
            return request_obj
 
        # PROVIDER RULES 
        if hasattr(user, "providerprofile") and request_obj.provider == user.providerprofile:

            # REJECT
            if new_status == "REJECTED":
                if not rejection_reason:
                    raise ValidationError("Rejection reason required.")

                request_obj.rejection_reason = rejection_reason
                
                NotificationService.notify(
                    user=request_obj.customer,
                    notification_type="REQUEST_REJECTED",
                    title="Request Rejected",
                    message=f"Your request was rejected: {rejection_reason}",
                    request=request_obj
                )
            
            if new_status == "ACCEPTED":
                NotificationService.notify(
                    user=request_obj.customer,
                    notification_type="REQUEST_ACCEPTED",
                    title="Request Accepted",
                    message=f"Your request for {request_obj.service.title} was accepted",
                    request=request_obj
                )

            # IN_PROGRESS (START OTP)
            if new_status == "IN_PROGRESS":
                if otp_code != request_obj.start_otp:
                    raise ValidationError("Invalid start OTP.")
                
                NotificationService.notify(
                    user=request_obj.customer,
                    notification_type="REQUEST_STARTED",
                    title="Service Started",
                    message="Your provider has started the service",
                    request=request_obj
                )

            # COMPLETED (FINAL OTP)
            if new_status == "COMPLETED":
                if otp_code != request_obj.complete_otp:
                    raise ValidationError("Invalid completion OTP.")

                request_obj.completed_at = timezone.now()
                
                NotificationService.notify(
                    user=request_obj.customer,
                    notification_type="REQUEST_COMPLETED",
                    title="Service Completed",
                    message="Service completed. Please leave a review.",
                    request=request_obj
                )
                
                ProviderProfile.objects.filter(pk=request_obj.provider.pk).update(
                    completed_jobs=F("completed_jobs") + 1
                )

            request_obj.status = new_status
            request_obj.save()
            return request_obj

        raise ValidationError("You are not allowed to modify this request.")