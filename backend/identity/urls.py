from django.urls import path

from .views import FaydaVerificationView


app_name = "identity"


urlpatterns = [
    path("verify-fayda/", FaydaVerificationView.as_view(), name="verify_fayda" ),
]