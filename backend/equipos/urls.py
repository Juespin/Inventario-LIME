from django.urls import path
from .views import (
    maintenance_events,
    update_maintenance_date,
    update_calibration_date
)

# Nota: EquiposViewSet ya está registrado en backend_lime/urls.py
# Solo incluimos aquí los endpoints adicionales de mantenimiento
urlpatterns = [
    path('maintenance-events/', maintenance_events, name='maintenance-events'),
    path('update-maintenance-date/', update_maintenance_date, name='update-maintenance-date'),
    path('update-calibration-date/', update_calibration_date, name='update-calibration-date'),
]