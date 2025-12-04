
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from equipos.views import EquiposViewSet
from responsables.views import ResponsablesViewSet
from sedes.views import SedesViewSet
from servicios.views import ServiciosViewSet
from rest_framework_simplejwt.views import TokenRefreshView

# Crear el router principal
router = routers.DefaultRouter()
router.register(r'equipos', EquiposViewSet)
router.register(r'responsables', ResponsablesViewSet)
router.register(r'sedes', SedesViewSet)
router.register(r'servicios', ServiciosViewSet)

# URLs de la API
urlpatterns = [
    path('admin/', admin.site.urls),
    # Incluir URLs de equipos ANTES del router para que las rutas personalizadas tengan prioridad
    path('api/equipos/', include('equipos.urls')),
    # Incluir URLs de usuarios (incluye token personalizado y registro)
    path('api/', include('users.urls')),
    # JWT token refresh endpoint
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Router de DRF (debe ir después de las rutas personalizadas)
    path('', include(router.urls)),  # Ruta raíz redirige a la API
    path('api/', include(router.urls)),
    # Añadir la autenticación de la API
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]