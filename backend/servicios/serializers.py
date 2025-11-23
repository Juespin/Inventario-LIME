from rest_framework import serializers
from .models import Servicio
from sedes.models import Sede


class ServiciosSerializer(serializers.ModelSerializer):
    # expose 'name' expected by the frontend while sourcing from 'nombre'
    name = serializers.CharField(source='nombre')
    # expose the FK as 'siteId' to match frontend typings (uses siteId)
    siteId = serializers.PrimaryKeyRelatedField(source='sede', queryset=Sede.objects.all())

    class Meta:
        model = Servicio
        fields = ['id', 'name', 'siteId']
        read_only_fields = ['id']
