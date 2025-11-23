from rest_framework import viewsets
from .models import Responsable
from .serializers import ResponsablesSerializer


class ResponsablesViewSet(viewsets.ModelViewSet):
	queryset = Responsable.objects.all()
	serializer_class = ResponsablesSerializer
