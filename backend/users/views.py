from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer
)
from .permissions import IsAdmin


class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para login que incluye información del rol"""
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(APIView):
    """Vista para obtener información del usuario actual"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Retornar información del usuario actual con su rol"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserRegistrationView(APIView):
    """Vista para registrar nuevos usuarios (solo administradores)"""
    permission_classes = [IsAdmin]
    
    def post(self, request):
        """Crear un nuevo usuario"""
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            user_serializer = UserSerializer(user)
            return Response(
                {
                    'message': 'Usuario creado exitosamente',
                    'user': user_serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


