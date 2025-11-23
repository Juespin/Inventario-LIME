from django.contrib import admin
from .models import Equipos


@admin.register(Equipos)
class EquiposAdmin(admin.ModelAdmin):
	list_display = ('codigo_udea', 'nombre_equipo', 'sede', 'servicio', 'responsable_proceso')
	search_fields = ('codigo_udea', 'nombre_equipo', 'codigo_ips')
	list_filter = ('sede', 'servicio')
