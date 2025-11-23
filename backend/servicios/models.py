from django.db import models


class Servicio(models.Model):
    nombre = models.CharField(max_length=150)
    sede = models.ForeignKey('sedes.Sede', on_delete=models.CASCADE, related_name='servicios')

    def __str__(self):
        return self.nombre
