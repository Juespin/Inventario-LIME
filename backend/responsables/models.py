from django.db import models


class Responsable(models.Model):
	nombre = models.CharField(max_length=200)
	cargo = models.CharField(max_length=150, blank=True)

	def __str__(self):
		return f"{self.nombre} - {self.cargo}" if self.cargo else self.nombre
