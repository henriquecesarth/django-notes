from datetime import timedelta
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CustomTokenObtainPairSerializer, UserSerializer, NoteSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Note, LongLivedRefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
import datetime


class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
            
class NoteDeleteView(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
LONG_LIVED_TOKEN_LIFETIME = timedelta(days=365)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.user
        remember_me = request.data.get("remember_me", False)
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200 and remember_me:
            LongLivedRefreshToken.objects.filter(user=user).delete()
            
            llrt = LongLivedRefreshToken.objects.create(
                user=user,
                expires_at=datetime.datetime.now(datetime.timezone.utc) + LONG_LIVED_TOKEN_LIFETIME
            )
            
            response.set_cookie(
                key="session_token",
                value=llrt.token,
                httponly=True,
                secure= False,
                samesite="Lax", 
                max_age=LONG_LIVED_TOKEN_LIFETIME.total_seconds(),
            )
        return response

class SessionRefreshView(APIView):
    permission_classes = [AllowAny]
    print("hello")
    def post(self, request):
        session_token = request.COOKIES.get("session_token")
        print(session_token)
        if not session_token:
            return Response({"detail": "Session token not found."}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            llrt = LongLivedRefreshToken.objects.get(token=session_token)
            if llrt.is_expired():
                llrt.delete()
                return Response({"detail": "Session expired."}, status=status.HTTP_401_UNAUTHORIZED)
                
            refresh = RefreshToken.for_user(llrt.user)
            
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
            
        except LongLivedRefreshToken.DoesNotExist:
            return Response({"detail": "Invalid session token."}, status=status.HTTP_401_UNAUTHORIZED)
        
class LogoutView(APIView):
    def post(self, request):
        try:
            llrt = LongLivedRefreshToken.objects.get(user=request.user)
            llrt.delete()
            response = Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
            response.delete_cookie("session_token")
            return response
        except LongLivedRefreshToken.DoesNotExist:
            return Response({"detail": "No active session to log out from."}, status=status.HTTP_400_BAD_REQUEST)