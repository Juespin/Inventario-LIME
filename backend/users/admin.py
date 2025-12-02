from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.apps import apps

@receiver(post_migrate)
def create_groups(sender, **kwargs):
    """Crear grupos de roles automáticamente después de las migraciones"""
    # Solo ejecutar si es la app users o auth
    if sender.name in ['users', 'auth']:
        # Crear grupo Administrador
        admin_group, created = Group.objects.get_or_create(name='Administrador')
        if created:
            print("Grupo 'Administrador' creado")
        
        # Crear grupo Lector
        reader_group, created = Group.objects.get_or_create(name='Lector')
        if created:
            print("Grupo 'Lector' creado")

