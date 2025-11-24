from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Equipos
from .serializers import EquiposSerializer

class EquiposViewSet(viewsets.ModelViewSet):
    queryset = Equipos.objects.all()
    serializer_class = EquiposSerializer
    # allow unauthenticated writes in development for easier testing from the frontend
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Equipos.objects.all()
        inventory_code = self.request.query_params.get('inventory_code', None)
        if inventory_code is not None:
            queryset = queryset.filter(inventory_code=inventory_code)
        return queryset

# Create your views here.
