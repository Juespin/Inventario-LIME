from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Servicio
from .serializers import ServiciosSerializer


class ServiciosViewSet(viewsets.ModelViewSet):
	queryset = Servicio.objects.all()
	serializer_class = ServiciosSerializer
	# allow unauthenticated writes in development (frontend creating records)
	permission_classes = [AllowAny]
