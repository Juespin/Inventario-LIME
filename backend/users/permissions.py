from rest_framework import permissions
from django.contrib.auth.models import Group


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado que permite:
    - Lectura (GET, HEAD, OPTIONS) a cualquier usuario autenticado
    - Escritura (POST, PUT, PATCH, DELETE) solo a usuarios en el grupo 'Administrador'
    """
    
    def has_permission(self, request, view):
        # Permitir métodos de lectura a cualquier usuario autenticado
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Para métodos de escritura, verificar si el usuario es administrador
        if request.user and request.user.is_authenticated:
            return self._is_admin(request.user)
        
        return False
    
    def _is_admin(self, user):
        """Verifica si el usuario pertenece al grupo 'Administrador'"""
        try:
            admin_group = Group.objects.get(name='Administrador')
            return admin_group in user.groups.all()
        except Group.DoesNotExist:
            return False


class IsAdmin(permissions.BasePermission):
    """
    Permiso que solo permite acceso a usuarios en el grupo 'Administrador'
    """
    
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return self._is_admin(request.user)
        return False
    
    def _is_admin(self, user):
        """Verifica si el usuario pertenece al grupo 'Administrador'"""
        try:
            admin_group = Group.objects.get(name='Administrador')
            return admin_group in user.groups.all()
        except Group.DoesNotExist:
            return False


def get_user_role(user):
    """
    Función auxiliar para obtener el rol del usuario.
    Retorna 'admin', 'reader' o None
    """
    if not user or not user.is_authenticated:
        return None
    
    try:
        admin_group = Group.objects.get(name='Administrador')
        reader_group = Group.objects.get(name='Lector')
        
        if admin_group in user.groups.all():
            return 'admin'
        elif reader_group in user.groups.all():
            return 'reader'
        else:
            return None
    except Group.DoesNotExist:
        return None


