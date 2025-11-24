from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Sede
from .serializers import SedesSerializer


class SedesViewSet(viewsets.ModelViewSet):
	queryset = Sede.objects.all()
	serializer_class = SedesSerializer
	# allow unauthenticated writes in development (frontend creating records)
	permission_classes = [AllowAny]
