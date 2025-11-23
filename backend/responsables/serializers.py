from rest_framework import serializers
from .models import Responsable


class ResponsablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsable
        fields = ['id', 'nombre', 'cargo']
        read_only_fields = ['id']
