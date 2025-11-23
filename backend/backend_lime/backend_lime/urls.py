
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from equipos.views import EquiposViewSet
from responsables.views import ResponsablesViewSet
from sedes.views import SedesViewSet
from servicios.views import ServiciosViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Crear el router principal
router = routers.DefaultRouter()
router.register(r'equipos', EquiposViewSet)
router.register(r'responsables', ResponsablesViewSet)
router.register(r'sedes', SedesViewSet)
router.register(r'servicios', ServiciosViewSet)

# URLs de la API
urlpatterns = [
    path('', include(router.urls)),  # Ruta raíz redirige a la API
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # JWT token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Añadir la autenticación de la API
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]