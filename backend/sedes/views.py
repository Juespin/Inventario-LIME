from rest_framework import viewsets
from .models import Sede
from .serializers import SedesSerializer


class SedesViewSet(viewsets.ModelViewSet):
	queryset = Sede.objects.all()
	serializer_class = SedesSerializer
