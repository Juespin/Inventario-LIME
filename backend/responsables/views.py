from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminOrReadOnly
from .models import Responsable
from .serializers import ResponsablesSerializer


class ResponsablesViewSet(viewsets.ModelViewSet):
	queryset = Responsable.objects.all()
	serializer_class = ResponsablesSerializer
	permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
