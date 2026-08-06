from django.urls import path

from .views import FaydaVerificationView, IdentityStatusView, RandomTestFinView


app_name = "identity"


urlpatterns = [
    path("verify-fayda/", FaydaVerificationView.as_view(), name="verify_fayda" ),
    
    #for testing and simulation purposes
    path("random-test-fin/", RandomTestFinView.as_view(), name="random_test_fin" ),
    path("status/", IdentityStatusView.as_view(), name="identity_status" ),
]