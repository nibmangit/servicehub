from .models import Review
from notifications.services import NotificationService


class ReviewService:

    @staticmethod
    def create_review(*, request_obj, rating, comment=None, ):
        review = Review.objects.create(
            request=request_obj,
            rating=rating,
            comment=comment,
        )

        NotificationService.notify(
            user=request_obj.provider.user,
            notification_type="NEW_REVIEW",
            title="New Review",
            message=f"You received a {rating}-star review.",
            request=request_obj,
        )

        return review