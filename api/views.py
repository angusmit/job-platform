from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Job
from .serializers import JobSerializer

class JobListCreate(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({'message': f'Hello {request.user.username}!'})

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from .serializers import ProfileSerializer, UserProfileSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    def put(self, request):
        try:
            user = request.user
            if not hasattr(user, 'profile'):
                Profile.objects.create(user=user)
            profile = user.profile
            
            # Handle user update
            user.email = request.data.get('email', user.email)
            user.save()
            
            # Handle profile data
            profile_data = {}
            for field in ['full_name', 'title', 'bio', 'skills', 'experience', 'education']:
                if f'profile.{field}' in request.data:
                    profile_data[field] = request.data[f'profile.{field}']
            
            profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True)
            
            if profile_serializer.is_valid():
                profile_serializer.save()
                
                # Handle file upload separately
                if 'profile.profile_picture' in request.data:
                    profile.profile_picture = request.data['profile.profile_picture']
                    profile.save()
                
                return Response(UserProfileSerializer(user).data)
            return Response(profile_serializer.errors, status=400)
        
        except Exception as e:
            import traceback
            print(traceback.format_exc())  # This will show the error in console
            return Response({'error': str(e)}, status=500)