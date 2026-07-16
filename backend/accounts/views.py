from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import UserRegisterSerializer

class UserRegisterView(APIView):
    # This endpoint must be open to everyone so guests can register accounts
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserRegisterSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        serializer.save() 
            
        return Response({"detail":"User account created successfully."}, status=201)