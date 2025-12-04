import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from equipos.models import Equipos
from sedes.models import Sede
from servicios.models import Servicio
from responsables.models import Responsable
from django.db import transaction

CSV_PATH = 'F-147 INVENTARIO EQUIPOS BIOMÉDICOS, INDUSTRIALES Y GASES V4.xlsx - Copia de Hoja1.csv'

# Utilidades para parsear fechas y booleanos

def parse_date(val):
    for fmt in ('%d/%m/%Y', '%d-%m-%Y', '%d/%m/%y', '%d-%m-%y', '%d/%m/%Y (%H:%M)', '%d/%m/%Y (%H:%M:%S)', '%d/%m/%Y (%H:%M)', '%d/%m/%Y (%H:%M:%S)', '%d/%m/%Y (%H:%M)', '%d/%m/%Y (%H:%M:%S)', '%d/%m/%Y', '%Y-%m-%d'):
        try:
            return datetime.strptime(val.strip(), fmt).date()
        except Exception:
            continue
    return None

def parse_bool(val):
    if not val:
        return False
    return str(val).strip().lower() in ['si', 'sí', 'yes', 'true', '1']

class Command(BaseCommand):
    help = 'Importa equipos desde el archivo CSV exportado de Excel.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        with open(CSV_PATH, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                # Sede
                sede_name = row['Sede'].strip() if row['Sede'] else None
                sede = Sede.objects.filter(nombre_sede=sede_name).first() if sede_name else None
                # Servicio
                servicio_name = row['Proceso'].strip() if row['Proceso'] else None
                servicio = Servicio.objects.filter(nombre=servicio_name).first() if servicio_name else None
                # Responsable (crear si no existe)
                responsable_name = row['Responsable del proceso en el que interviene el equipo y/o inventario UdeA'].strip() if row['Responsable del proceso en el que interviene el equipo y/o inventario UdeA'] else None
                responsable = None
                if responsable_name:
                    responsable, _ = Responsable.objects.get_or_create(name=responsable_name, defaults={"role": ""})
                # Omitir si ya existe un equipo con el mismo ips_code (no vacío)
                ips_code = row['Código IPS'] or None
                if ips_code:
                    if Equipos.objects.filter(ips_code=ips_code).exists():
                        continue  # Omitir duplicado
                equipo = Equipos(
                    inventory_code=row['Código de inventario interno del laboratorio y/o asignado por UdeA'] or None,
                    name=row['Nombre del equipo'] or None,
                    brand=row['Marca'] or None,
                    model=row['Modelo'] or None,
                    serial=row['Serie'] or None,
                    site=sede,
                    service=servicio,
                    ips_code=ips_code,
                    ecri_code=row['Código ECRI'] or '',
                    responsible=responsable,
                    physical_location=row['Ubicación física'] or None,
                    misional_classification=row['Clasificación según eje misional (Docencia y/o Investigación y/o Extensión)'] or None,
                    ips_classification=row['Clasificación IPS (IND-BIO-Gases)'] or None,
                    risk_classification=row['Clasificación por riesgo'] or None,
                    invima_record=row['Registro Invima/Permiso comercialización/No Requiere'] or None,
                    useful_life=None,  # No mapeado directo
                    acquisition_date=parse_date(row['Antigüedad del eq. (F. adquisición)']) if row['Antigüedad del eq. (F. adquisición)'] else None,
                    owner=row['Propietario del equipo'] or None,
                    fabrication_date=parse_date(row['Fecha de fabricación']) if row['Fecha de fabricación'] else None,
                    nit=row['NIT'] or None,
                    provider=row['Proveedor equipo'] or None,
                    in_warranty=parse_bool(row['Está en garantía (Si/No)']),
                    warranty_end_date=parse_date(row['Fecha finalización garantía']) if row['Fecha finalización garantía'] else None,
                    acquisition_method=row['Forma de adquisición'] or None,
                    document_type=row['Tipo de documento'] or None,
                    document_number=row['Número de documento'] or None,
                    purchase_value=row['Valor de compra'] or None,
                    has_life_sheet=parse_bool(row['Hoja de vida']),
                    has_import_registration=parse_bool(row['Registro de importación']),
                    has_operation_manual=parse_bool(row['Manual operación (Esp)']),
                    has_maintenance_manual=parse_bool(row['Manual servicio mto (Esp)']),
                    has_quick_guide=parse_bool(row['Guía Rápida de uso']),
                    has_instruction_manual=parse_bool(row['Instructivo de manejo rápido de equipos']),
                    has_maintenance_protocol=parse_bool(row['Protocolo Mto Prev.']),
                    metrology_frequency=row['Frecuencia metrológica fabricante'] or None,
                    maintenance_required=parse_bool(row['Mantenimiento Si/No']),
                    maintenance_frequency=int(row['Frecuencia anual mantenimiento']) if row['Frecuencia anual mantenimiento'] and row['Frecuencia anual mantenimiento'].isdigit() else None,
                    calibration_required=parse_bool(row['Calibración Si/No']),
                    calibration_frequency=int(row['Frecuencia anual calibración']) if row['Frecuencia anual calibración'] and row['Frecuencia anual calibración'].isdigit() else None,
                    magnitude=row['Magnitud'] or None,
                    measurement_range=row['Rango del equipo'] or None,
                    resolution=row['Resolución'] or None,
                    work_range=row['Rango de trabajo'] or None,
                    max_permitted_error=row['Error máximo permitido'] or None,
                    voltage=row['Voltaje'] or None,
                    current=row['Corriente'] or None,
                    relative_humidity=row['Humedad relativa'] or None,
                    operating_temperature=row['Temperatura'] or None,
                    dimensions=row['Dimensiones'] or None,
                    weight=row['Peso'] or None,
                    others=row['Otros'] or None,
                )
                equipo.save()
                count += 1
            self.stdout.write(self.style.SUCCESS(f'Se importaron {count} equipos desde el CSV.'))
