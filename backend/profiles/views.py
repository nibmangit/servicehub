from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
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
    
class MyProfileView(RetrieveUpdateAPIView): 
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user.userprofile