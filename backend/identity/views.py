from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

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