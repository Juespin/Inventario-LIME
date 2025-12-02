from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group


class Command(BaseCommand):
    help = 'Crea usuarios de prueba para el sistema'

    def handle(self, *args, **options):
        # Definir usuarios a crear
        users_data = [
            {'username': 'angelower', 'password': '2025', 'email': 'angelower@test.com', 'role': 'admin'},
            {'username': 'aleja', 'password': '2701', 'email': 'aleja@test.com', 'role': 'reader'},
            {'username': 'juanes', 'password': '0709', 'email': 'juanes@test.com', 'role': 'reader'},
            {'username': 'meli', 'password': '0703', 'email': 'meli@test.com', 'role': 'reader'},
        ]

        # Obtener o crear grupos
        try:
            admin_group = Group.objects.get(name='Administrador')
        except Group.DoesNotExist:
            admin_group = Group.objects.create(name='Administrador')
            self.stdout.write(self.style.SUCCESS("Grupo 'Administrador' creado"))

        try:
            reader_group = Group.objects.get(name='Lector')
        except Group.DoesNotExist:
            reader_group = Group.objects.create(name='Lector')
            self.stdout.write(self.style.SUCCESS("Grupo 'Lector' creado"))

        created_count = 0
        updated_count = 0

        for user_data in users_data:
            username = user_data['username']
            password = user_data['password']
            email = user_data.get('email', f'{username}@test.com')
            role = user_data.get('role', 'admin')

            # Determinar grupo según el rol
            target_group = admin_group if role == 'admin' else reader_group

            # Verificar si el usuario ya existe
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'is_active': True,
                }
            )

            if created:
                user.set_password(password)
                user.save()
                user.groups.add(target_group)
                self.stdout.write(
                    self.style.SUCCESS(f"✓ Usuario '{username}' creado exitosamente ({'Administrador' if role == 'admin' else 'Lector'})")
                )
                created_count += 1
            else:
                # Si ya existe, actualizar contraseña y grupo
                user.set_password(password)
                user.email = email
                user.is_active = True
                user.save()
                # Remover de otros grupos y agregar al grupo correcto
                user.groups.clear()
                user.groups.add(target_group)
                self.stdout.write(
                    self.style.WARNING(f"→ Usuario '{username}' ya existía, actualizado ({'Administrador' if role == 'admin' else 'Lector'})")
                )
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(f"\n✅ Proceso completado:"))
        self.stdout.write(f"   - Usuarios creados: {created_count}")
        self.stdout.write(f"   - Usuarios actualizados: {updated_count}")
        self.stdout.write(self.style.SUCCESS(f"\n📋 Usuarios disponibles:"))
        for user_data in users_data:
            role_name = 'Administrador' if user_data.get('role', 'admin') == 'admin' else 'Lector'
            self.stdout.write(f"   - {user_data['username']} / {user_data['password']} ({role_name})")


