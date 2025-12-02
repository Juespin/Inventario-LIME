from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from calendar import monthrange
from users.permissions import IsAdminOrReadOnly, IsAdmin
from .models import Equipos
from .serializers import EquiposSerializer

class EquiposViewSet(viewsets.ModelViewSet):
    queryset = Equipos.objects.all()
    serializer_class = EquiposSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Equipos.objects.all()
        inventory_code = self.request.query_params.get('inventory_code', None)
        if inventory_code is not None:
            queryset = queryset.filter(inventory_code=inventory_code)
        return queryset


def calculate_next_date(last_date, frequency_months):
    """Calcula la próxima fecha de mantenimiento/calibración basándose en la última fecha y frecuencia"""
    if not last_date or not frequency_months or frequency_months <= 0:
        return None
    
    # Calcular la próxima fecha sumando los meses
    year = last_date.year
    month = last_date.month + frequency_months
    
    # Ajustar año si los meses exceden 12
    while month > 12:
        month -= 12
        year += 1
    
    try:
        return date(year, month, last_date.day)
    except ValueError:
        # Si el día no existe en el mes (ej: 31 de febrero), usar el último día del mes
        last_day = monthrange(year, month)[1]
        return date(year, month, min(last_date.day, last_day))


def calculate_days_remaining(next_date):
    """Calcula los días restantes hasta una fecha"""
    if not next_date:
        return None
    
    today = date.today()
    delta = (next_date - today).days
    return delta


def get_maintenance_status(days_remaining):
    """Determina el estado de un evento de mantenimiento"""
    if days_remaining is None:
        return 'upcoming'
    
    if days_remaining < 0:
        return 'overdue'  # Vencido
    elif days_remaining <= 30:
        return 'due'  # Próximo (dentro de 30 días)
    else:
        return 'upcoming'  # Próximo pero no urgente


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def maintenance_events(request):
    """
    Endpoint para obtener eventos de mantenimiento y calibración calculados.
    Retorna una lista de eventos con información sobre próximos mantenimientos.
    """
    # Filtrar solo equipos activos
    equipos = Equipos.objects.filter(status='Activo')
    
    events = []
    
    for equipo in equipos:
        # Generar evento de mantenimiento si está configurado
        if equipo.maintenance_required and equipo.maintenance_frequency:
            last_maintenance_date = equipo.last_maintenance_date or equipo.acquisition_date
            
            if last_maintenance_date:
                next_maintenance_date = calculate_next_date(last_maintenance_date, equipo.maintenance_frequency)
                
                if next_maintenance_date:
                    days_remaining = calculate_days_remaining(next_maintenance_date)
                    status_event = get_maintenance_status(days_remaining)
                    
                    events.append({
                        'id': f'{equipo.id}-maintenance',
                        'equipmentId': str(equipo.id),
                        'equipmentName': equipo.name,
                        'inventoryCode': equipo.inventory_code,
                        'type': 'maintenance',
                        'lastDate': last_maintenance_date.isoformat() if last_maintenance_date else '',
                        'nextDate': next_maintenance_date.isoformat(),
                        'frequency': equipo.maintenance_frequency,
                        'daysRemaining': days_remaining if days_remaining is not None else 0,
                        'status': status_event,
                        'siteId': equipo.site.id if equipo.site else None,
                        'serviceId': equipo.service.id if equipo.service else None,
                        'responsibleId': equipo.responsible.id if equipo.responsible else None,
                    })
        
        # Generar evento de calibración si está configurado
        if equipo.calibration_required and equipo.calibration_frequency:
            last_calibration_date = equipo.last_calibration_date or equipo.acquisition_date
            
            if last_calibration_date:
                next_calibration_date = calculate_next_date(last_calibration_date, equipo.calibration_frequency)
                
                if next_calibration_date:
                    days_remaining = calculate_days_remaining(next_calibration_date)
                    status_event = get_maintenance_status(days_remaining)
                    
                    events.append({
                        'id': f'{equipo.id}-calibration',
                        'equipmentId': str(equipo.id),
                        'equipmentName': equipo.name,
                        'inventoryCode': equipo.inventory_code,
                        'type': 'calibration',
                        'lastDate': last_calibration_date.isoformat() if last_calibration_date else '',
                        'nextDate': next_calibration_date.isoformat(),
                        'frequency': equipo.calibration_frequency,
                        'daysRemaining': days_remaining if days_remaining is not None else 0,
                        'status': status_event,
                        'siteId': equipo.site.id if equipo.site else None,
                        'serviceId': equipo.service.id if equipo.service else None,
                        'responsibleId': equipo.responsible.id if equipo.responsible else None,
                    })
    
    # Ordenar eventos por urgencia (más urgentes primero)
    events.sort(key=lambda x: (
        0 if x['daysRemaining'] < 0 else 1,  # Vencidos primero
        x['daysRemaining']  # Luego por días restantes
    ))
    
    return Response(events)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_maintenance_date(request):
    """
    Endpoint para actualizar la fecha de último mantenimiento de un equipo.
    Requiere: equipment_id (int) y date (YYYY-MM-DD)
    """
    equipment_id = request.data.get('equipment_id')
    date_str = request.data.get('date')
    
    if not equipment_id:
        return Response(
            {'error': 'equipment_id es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not date_str:
        return Response(
            {'error': 'date es requerido (formato YYYY-MM-DD)'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        equipment = Equipos.objects.get(id=equipment_id)
    except Equipos.DoesNotExist:
        return Response(
            {'error': 'Equipo no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if equipment.status != 'Activo':
        return Response(
            {'error': 'Solo se puede actualizar la fecha de mantenimiento para equipos activos'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        maintenance_date = date.fromisoformat(date_str)
    except ValueError:
        return Response(
            {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    equipment.last_maintenance_date = maintenance_date
    equipment.save()
    
    return Response({
        'success': True,
        'equipment_id': equipment.id,
        'last_maintenance_date': maintenance_date.isoformat()
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_calibration_date(request):
    """
    Endpoint para actualizar la fecha de última calibración de un equipo.
    Requiere: equipment_id (int) y date (YYYY-MM-DD)
    """
    equipment_id = request.data.get('equipment_id')
    date_str = request.data.get('date')
    
    if not equipment_id:
        return Response(
            {'error': 'equipment_id es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not date_str:
        return Response(
            {'error': 'date es requerido (formato YYYY-MM-DD)'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        equipment = Equipos.objects.get(id=equipment_id)
    except Equipos.DoesNotExist:
        return Response(
            {'error': 'Equipo no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if equipment.status != 'Activo':
        return Response(
            {'error': 'Solo se puede actualizar la fecha de calibración para equipos activos'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        calibration_date = date.fromisoformat(date_str)
    except ValueError:
        return Response(
            {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    equipment.last_calibration_date = calibration_date
    equipment.save()
    
    return Response({
        'success': True,
        'equipment_id': equipment.id,
        'last_calibration_date': calibration_date.isoformat()
    })
