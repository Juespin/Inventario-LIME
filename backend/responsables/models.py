from django.db import models


class Responsable(models.Model):
	# normalized names
	name = models.CharField(max_length=200)
	role = models.CharField(max_length=150, blank=True)

	def __str__(self):
		return f"{self.name} - {self.role}" if self.role else self.name
