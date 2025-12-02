from rest_framework import serializers
from django.contrib.auth.models import User, Group
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .permissions import get_user_role


class UserSerializer(serializers.ModelSerializer):
    """Serializador para información de usuario con rol"""
    role = serializers.SerializerMethodField()
    groups = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'groups']
        read_only_fields = ['id', 'role', 'groups']
    
    def get_role(self, obj):
        """Obtener el rol del usuario"""
        role = get_user_role(obj)
        if role == 'admin':
            return 'admin'
        elif role == 'reader':
            return 'reader'
        return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializador para registro de nuevos usuarios (solo admin puede usar)"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=['admin', 'reader'], write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
        }
    
    def validate(self, attrs):
        """Validar que las contraseñas coincidan"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs
    
    def validate_username(self, value):
        """Validar que el username no exista"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value
    
    def validate_email(self, value):
        """Validar que el email no exista"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está en uso.")
        return value
    
    def create(self, validated_data):
        """Crear usuario y asignar al grupo correspondiente"""
        role = validated_data.pop('role')
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Crear usuario
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        
        # Asignar al grupo correspondiente
        try:
            if role == 'admin':
                group = Group.objects.get(name='Administrador')
            else:
                group = Group.objects.get(name='Lector')
            user.groups.add(group)
        except Group.DoesNotExist:
            # Si los grupos no existen, crearlos
            if role == 'admin':
                group = Group.objects.create(name='Administrador')
            else:
                group = Group.objects.create(name='Lector')
            user.groups.add(group)
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado para incluir información del rol en el token JWT"""
    
    @classmethod
    def get_token(cls, user):
        """Agregar información del rol al token"""
        token = super().get_token(user)
        
        # Agregar información del usuario al token
        role = get_user_role(user)
        token['role'] = role
        token['username'] = user.username
        token['user_id'] = user.id
        
        return token
    
    def validate(self, attrs):
        """Validar y retornar datos con información adicional del usuario"""
        data = super().validate(attrs)
        
        # Agregar información adicional en la respuesta
        user = self.user
        role = get_user_role(user)
        
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': role,
        }
        
        return data


