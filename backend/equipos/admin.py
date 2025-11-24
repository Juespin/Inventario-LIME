from django.contrib import admin
from .models import Equipos


@admin.register(Equipos)
class EquiposAdmin(admin.ModelAdmin):
	list_display = ('inventory_code', 'name', 'site', 'service', 'responsible')
	search_fields = ('inventory_code', 'name', 'ips_code')
	list_filter = ('site', 'service')
