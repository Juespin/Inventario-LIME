from rest_framework import viewsets
from .models import Servicio
from .serializers import ServiciosSerializer


class ServiciosViewSet(viewsets.ModelViewSet):
	queryset = Servicio.objects.all()
	serializer_class = ServiciosSerializer
