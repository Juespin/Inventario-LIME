from rest_framework import serializers
from .models import Equipos
from responsables.serializers import ResponsablesSerializer
from sedes.serializers import SedesSerializer
from servicios.serializers import ServiciosSerializer

class EquiposSerializer(serializers.ModelSerializer):
    responsable_details = ResponsablesSerializer(source='responsable_proceso', read_only=True)
    sede_details = SedesSerializer(source='sede', read_only=True)
    servicio_details = ServiciosSerializer(source='servicio', read_only=True)
    display = serializers.CharField(source='__str__', read_only=True)
    full = serializers.SerializerMethodField()

    class Meta:
        model = Equipos
        fields = [
            'id', 'codigo_udea', 'nombre_equipo', 'marca', 'modelo', 'serie',
            'codigo_ips', 'codigo_ecri', 'sede', 'sede_details', 'servicio', 'servicio_details',
            'responsable_proceso', 'responsable_details', 'ubicacion', 'display'
        , 'full'
        ]
        read_only_fields = ['id', 'display', 'full']

    def get_full(self, obj):
        return obj.as_dict()