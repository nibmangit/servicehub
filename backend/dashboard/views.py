from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .services import DashboardService


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        if hasattr(user, "providerprofile"):
            data = DashboardService.get_provider_dashboard(user)
        else:
            data = DashboardService.get_customer_dashboard(user)

        return Response(data)