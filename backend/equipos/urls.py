from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import EquiposViewSet

router = DefaultRouter()
router.register(r'equipos', EquiposViewSet)

urlpatterns = [
    path('', include(router.urls)),
]