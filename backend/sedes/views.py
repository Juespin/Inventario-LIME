from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminOrReadOnly
from .models import Sede
from .serializers import SedesSerializer


class SedesViewSet(viewsets.ModelViewSet):
	queryset = Sede.objects.all()
	serializer_class = SedesSerializer
	permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
