from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    EquiposViewSet,
    maintenance_events,
    update_maintenance_date,
    update_calibration_date
)

router = DefaultRouter()
router.register(r'equipos', EquiposViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('maintenance-events/', maintenance_events, name='maintenance-events'),
    path('update-maintenance-date/', update_maintenance_date, name='update-maintenance-date'),
    path('update-calibration-date/', update_calibration_date, name='update-calibration-date'),
]