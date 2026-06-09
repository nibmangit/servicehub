from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import *

class BecomeProviderView(APIView): 
    permission_classes = [IsAuthenticated]

    def post(self, request): 
        serializer = ProviderProfileSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "detail": "Account upgraded to Service Provider successfully.", 
                    "provider_profile": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MyProfileView(APIView): 
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.userprofile 
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        profile = request.user.userprofile 
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)