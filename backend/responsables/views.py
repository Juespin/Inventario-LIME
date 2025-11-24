from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Responsable
from .serializers import ResponsablesSerializer


class ResponsablesViewSet(viewsets.ModelViewSet):
	queryset = Responsable.objects.all()
	serializer_class = ResponsablesSerializer
	# allow unauthenticated writes in development (frontend creating records)
	permission_classes = [AllowAny]
