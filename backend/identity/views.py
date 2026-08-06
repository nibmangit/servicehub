from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

#for testing and simulation purposes
from .models import IdentityVerification, FakeFaydaCitizen
from .serializers import IdentityVerificationSerializer

from .serializers import (
    FaydaVerificationSerializer,
    IdentityVerificationSerializer
)


class FaydaVerificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = FaydaVerificationSerializer(
            data=request.data,
            context={
                "request": request
            }
        )


        if serializer.is_valid():
            verification = serializer.save()
            response_serializer = IdentityVerificationSerializer(verification )

            return Response(
                {
                    "detail": "Identity verified successfully.",
                    "verification": response_serializer.data
                }, status=status.HTTP_200_OK
            )


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST )
    

class IdentityStatusView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        verification = IdentityVerification.objects.filter(user=request.user).first()
        if not verification:
            return Response({"status": "none"}, status=status.HTTP_200_OK)
        
        serializer = IdentityVerificationSerializer(verification)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RandomTestFinView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch a random active Fayda citizen's FIN for simulation testing
        random_citizen = FakeFaydaCitizen.objects.filter(is_active=True).order_by('?').first()
        if not random_citizen:
            return Response({"detail": "No active test citizens available."}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({"fin": random_citizen.fin}, status=status.HTTP_200_OK)