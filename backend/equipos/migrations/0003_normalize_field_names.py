from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('equipos', '0002_equipos_estado_alter_equipos_frecuencia_calibracion_and_more'),
    ]

    operations = [
        # Basic fields
        migrations.RenameField(model_name='equipos', old_name='codigo_udea', new_name='inventory_code'),
        migrations.RenameField(model_name='equipos', old_name='nombre_equipo', new_name='name'),
        migrations.RenameField(model_name='equipos', old_name='marca', new_name='brand'),
        migrations.RenameField(model_name='equipos', old_name='modelo', new_name='model'),
        migrations.RenameField(model_name='equipos', old_name='serie', new_name='serial'),
        migrations.RenameField(model_name='equipos', old_name='estado', new_name='status'),

        # Foreign keys
        migrations.RenameField(model_name='equipos', old_name='sede', new_name='site'),
        migrations.RenameField(model_name='equipos', old_name='servicio', new_name='service'),
        migrations.RenameField(model_name='equipos', old_name='responsable_proceso', new_name='responsible'),

        # Codes & location
        migrations.RenameField(model_name='equipos', old_name='codigo_ips', new_name='ips_code'),
        migrations.RenameField(model_name='equipos', old_name='codigo_ecri', new_name='ecri_code'),
        migrations.RenameField(model_name='equipos', old_name='ubicacion', new_name='physical_location'),

        # Classifications and records
        migrations.RenameField(model_name='equipos', old_name='clasificacion_misional', new_name='misional_classification'),
        migrations.RenameField(model_name='equipos', old_name='clasificacion_ips', new_name='ips_classification'),
        migrations.RenameField(model_name='equipos', old_name='clasificacion_riesgo', new_name='risk_classification'),
        migrations.RenameField(model_name='equipos', old_name='registro_invima', new_name='invima_record'),

        # Historical
        migrations.RenameField(model_name='equipos', old_name='vida_util', new_name='useful_life'),
        migrations.RenameField(model_name='equipos', old_name='fecha_adquisicion', new_name='acquisition_date'),
        migrations.RenameField(model_name='equipos', old_name='propietario', new_name='owner'),
        migrations.RenameField(model_name='equipos', old_name='fecha_fabricacion', new_name='fabrication_date'),

        # Provider & docs
        migrations.RenameField(model_name='equipos', old_name='proveedor', new_name='provider'),
        migrations.RenameField(model_name='equipos', old_name='garantia', new_name='in_warranty'),
        migrations.RenameField(model_name='equipos', old_name='finalizacion_garantia', new_name='warranty_end_date'),
        migrations.RenameField(model_name='equipos', old_name='forma_adquisicion', new_name='acquisition_method'),
        migrations.RenameField(model_name='equipos', old_name='tipo_documento', new_name='document_type'),
        migrations.RenameField(model_name='equipos', old_name='numero_documento', new_name='document_number'),
        migrations.RenameField(model_name='equipos', old_name='valor_compra', new_name='purchase_value'),

        # Document booleans
        migrations.RenameField(model_name='equipos', old_name='hoja_de_vida', new_name='has_life_sheet'),
        migrations.RenameField(model_name='equipos', old_name='registro_importacion', new_name='has_import_registration'),
        migrations.RenameField(model_name='equipos', old_name='manual_operacion', new_name='has_operation_manual'),
        migrations.RenameField(model_name='equipos', old_name='manual_mantenimiento', new_name='has_maintenance_manual'),
        migrations.RenameField(model_name='equipos', old_name='guia_rapida', new_name='has_quick_guide'),
        migrations.RenameField(model_name='equipos', old_name='instructivo_de_manejo', new_name='has_instruction_manual'),
        migrations.RenameField(model_name='equipos', old_name='protocolo_mantenimiento', new_name='has_maintenance_protocol'),

        # Metrology
        migrations.RenameField(model_name='equipos', old_name='frecuencia_metrologia', new_name='metrology_frequency'),
        migrations.RenameField(model_name='equipos', old_name='mantenimiento', new_name='maintenance_required'),
        migrations.RenameField(model_name='equipos', old_name='frecuencia_mantenimiento', new_name='maintenance_frequency'),
        migrations.RenameField(model_name='equipos', old_name='calibracion', new_name='calibration_required'),
        migrations.RenameField(model_name='equipos', old_name='frecuencia_calibracion', new_name='calibration_frequency'),

        # Technical metrology
        migrations.RenameField(model_name='equipos', old_name='magnitud', new_name='magnitude'),
        migrations.RenameField(model_name='equipos', old_name='rango_medicion', new_name='measurement_range'),
        migrations.RenameField(model_name='equipos', old_name='resolucion', new_name='resolution'),
        migrations.RenameField(model_name='equipos', old_name='rango_trabajo', new_name='work_range'),
        migrations.RenameField(model_name='equipos', old_name='error_maximo_permitido', new_name='max_permitted_error'),

        # Operating
        migrations.RenameField(model_name='equipos', old_name='voltaje', new_name='voltage'),
        migrations.RenameField(model_name='equipos', old_name='corriente', new_name='current'),
        migrations.RenameField(model_name='equipos', old_name='humedad_relativa', new_name='relative_humidity'),
        migrations.RenameField(model_name='equipos', old_name='temperatura_operacion', new_name='operating_temperature'),
        migrations.RenameField(model_name='equipos', old_name='dimensiones', new_name='dimensions'),
        migrations.RenameField(model_name='equipos', old_name='peso', new_name='weight'),
        migrations.RenameField(model_name='equipos', old_name='otros', new_name='others'),
    ]
