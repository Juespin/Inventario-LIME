from django.db import models


class Sede(models.Model):
    nombre_sede = models.CharField(max_length=150)
    
    def __str__(self):
        return self.nombre_sede
