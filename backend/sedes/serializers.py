from rest_framework import serializers
from .models import Sede


class SedesSerializer(serializers.ModelSerializer):
    # expose a 'name' field expected by the frontend while sourcing from 'nombre_sede'
    name = serializers.CharField(source='nombre_sede')

    class Meta:
        model = Sede
        fields = ['id', 'name']
        read_only_fields = ['id']
