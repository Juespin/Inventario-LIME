from rest_framework import viewsets
from .models import Equipos
from .serializers import EquiposSerializer

class EquiposViewSet(viewsets.ModelViewSet):
    queryset = Equipos.objects.all()
    serializer_class = EquiposSerializer

    def get_queryset(self):
        queryset = Equipos.objects.all()
        codigo_udea = self.request.query_params.get('codigo_udea', None)
        if codigo_udea is not None:
            queryset = queryset.filter(codigo_udea=codigo_udea)
        return queryset

# Create your views here.
