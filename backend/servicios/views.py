from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminOrReadOnly
from .models import Servicio
from .serializers import ServiciosSerializer


class ServiciosViewSet(viewsets.ModelViewSet):
	queryset = Servicio.objects.all()
	serializer_class = ServiciosSerializer
	permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
