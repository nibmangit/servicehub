from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *

class ProviderApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        application = ProviderApplication.objects.filter(user=request.user).order_by('-submitted_at').first()
        if not application:
            return Response({"detail": "No application found.", "status": "none"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProviderApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Prevent duplicate submissions if pending or approved
        existing = ProviderApplication.objects.filter(user=request.user).first()
        if existing and existing.status in ['pending', 'approved']:
            return Response(
                {"detail": f"You already have an application with status: {existing.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProviderApplicationSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "detail": "Provider application submitted successfully.",
                    "application": serializer.data
                }, status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        """Allows resubmitting/updating a rejected application back to pending."""
        application = ProviderApplication.objects.filter(user=request.user, status='rejected').first()
        if not application:
            return Response({"detail": "No rejected application available for re-submission."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProviderApplicationSerializer(
            application,
            data=request.data,
            partial=True,
            context={"request": request}
        )
        if serializer.is_valid():
            # Reset status to pending upon update
            application.status = 'pending'
            application.rejection_reason = ''
            
            skills = serializer.validated_data.pop('skills', None)
            if skills is not None:
                application.skills.set(skills)
                
            serializer.save()
            return Response(
                {
                    "detail": "Application updated and re-submitted for review.",
                    "application": serializer.data
                }, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MyProfileView(RetrieveUpdateAPIView): 
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user.userprofile
    

class PublicProviderProfileView(RetrieveAPIView):
    serializer_class = PublicProviderProfileSerializer
    permission_classes = [AllowAny]
    queryset = ProviderProfile.objects.select_related('user', 'user__userprofile')
    
class SkillListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SkillSerializer
    pagination_class = None  # Disable pagination
    queryset = Skill.objects.filter(is_active=True)