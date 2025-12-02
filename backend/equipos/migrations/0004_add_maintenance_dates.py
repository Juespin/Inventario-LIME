from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('equipos', '0003_normalize_field_names'),
    ]

    operations = [
        migrations.AddField(
            model_name='equipos',
            name='last_maintenance_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='equipos',
            name='last_calibration_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]


