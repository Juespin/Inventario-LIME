from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('responsables', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(model_name='responsable', old_name='nombre', new_name='name'),
        migrations.RenameField(model_name='responsable', old_name='cargo', new_name='role'),
    ]
