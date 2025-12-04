from django.db import models
from sedes.models import Sede
from servicios.models import Servicio
from responsables.models import Responsable

class Equipos(models.Model):
    # normalized field names to match frontend (english)
    # Many fields should be optional for the create flow so the frontend can
    # submit partial payloads. We allow NULL/blank for non-essential fields.
    inventory_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    brand = models.CharField(max_length=20, null=True, blank=True)
    model = models.CharField(max_length=100, null=True, blank=True)
    serial = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=50, null=True, blank=True)
    site = models.ForeignKey(Sede, on_delete=models.CASCADE, related_name='equipos', null=True, blank=True)
    service = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='equipos', null=True, blank=True)
    ips_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    ecri_code = models.CharField(max_length=100)
    responsible = models.ForeignKey(Responsable, on_delete=models.CASCADE, related_name='equipos')
    physical_location = models.CharField(max_length=200, null=True, blank=True)
    misional_classification = models.CharField(max_length=100, null=True, blank=True)
    ips_classification = models.CharField(max_length=100, null=True, blank=True)
    risk_classification = models.CharField(max_length=100, null=True, blank=True)
    invima_record = models.CharField(max_length=100, null=True, blank=True)
    useful_life = models.IntegerField(null=True, blank=True)
    acquisition_date = models.DateField(null=True, blank=True)
    owner = models.CharField(max_length=100, null=True, blank=True)
    fabrication_date = models.DateField(null=True, blank=True)
    nit= models.CharField(max_length=50, null=True, blank=True)
    provider = models.CharField(max_length=100, null=True, blank=True)
    in_warranty = models.BooleanField(default=False)
    warranty_end_date= models.DateField(null=True, blank=True)
    acquisition_method= models.CharField(max_length=50, null=True, blank=True)
    document_type= models.CharField(max_length=50, null=True, blank=True)
    document_number=models.CharField(max_length=50, null=True, blank=True)
    purchase_value= models.CharField(max_length=50, null=True, blank=True)
    has_life_sheet=  models.BooleanField(default=False)
    has_import_registration=  models.BooleanField(default=False)
    has_operation_manual=  models.BooleanField(default=False)
    has_maintenance_manual=  models.BooleanField(default=False)
    has_quick_guide=  models.BooleanField(default=False)
    has_instruction_manual=  models.BooleanField(default=False)
    has_maintenance_protocol=  models.BooleanField(default=False)
    metrology_frequency= models.CharField(max_length=100, null=True, blank=True)
    maintenance_required=  models.BooleanField(default=False)
    maintenance_frequency= models.IntegerField(null=True, blank=True)
    last_maintenance_date = models.DateField(null=True, blank=True)
    calibration_required=  models.BooleanField(default=False)
    calibration_frequency= models.IntegerField(null=True, blank=True)
    last_calibration_date = models.DateField(null=True, blank=True)
    magnitude= models.CharField(max_length=100, null=True, blank=True)
    measurement_range= models.CharField(max_length=100, null=True, blank=True)
    resolution= models.CharField(max_length=100, null=True, blank=True)
    work_range= models.CharField(max_length=100, null=True, blank=True)
    max_permitted_error=  models.CharField(max_length=100, null=True, blank=True)
    voltage= models.CharField(max_length=50, null=True, blank=True)
    current= models.CharField(max_length=50, null=True, blank=True)
    relative_humidity= models.CharField(max_length=50, null=True, blank=True)
    operating_temperature= models.CharField(max_length=50, null=True, blank=True)
    dimensions= models.CharField(max_length=100, null=True, blank=True)
    weight= models.CharField(max_length=50, null=True, blank=True)
    others= models.TextField(null=True, blank=True) 

    

    def __str__(self):
        return f'{self.inventory_code} - {self.name}'

    def as_dict(self):
        """Return a dict with useful fields for API/frontend consumption.

        Related objects are represented by their string form and their id.
        Dates are returned as ISO strings when present.
        """
        def _date_to_iso(d):
            return d.isoformat() if d is not None else None

        return {
            'id': self.id,
            'inventory_code': self.inventory_code,
            'name': self.name,
            'brand': self.brand,
            'model': self.model,
            'serial': self.serial,
            'site_id': getattr(self, 'site_id', None),
            'site': str(self.site) if self.site_id else None,
            'service_id': getattr(self, 'service_id', None),
            'service': str(self.service) if self.service_id else None,
            'responsible_id': getattr(self, 'responsible_id', None),
            'responsible': str(self.responsible) if self.responsible_id else None,
            'physical_location': self.physical_location,
            'misional_classification': self.misional_classification,
            'ips_classification': self.ips_classification,
            'risk_classification': self.risk_classification,
            'invima_record': self.invima_record,
            'useful_life': self.useful_life,
            'acquisition_date': _date_to_iso(self.acquisition_date),
            'owner': self.owner,
            'fabrication_date': _date_to_iso(self.fabrication_date),
            'nit': self.nit,
            'provider': self.provider,
            'in_warranty': self.in_warranty,
            'warranty_end_date': _date_to_iso(self.warranty_end_date),
            'acquisition_method': self.acquisition_method,
            'document_type': self.document_type,
            'document_number': self.document_number,
            'purchase_value': self.purchase_value,
            'has_life_sheet': self.has_life_sheet,
            'has_import_registration': self.has_import_registration,
            'has_operation_manual': self.has_operation_manual,
            'has_maintenance_manual': self.has_maintenance_manual,
            'has_quick_guide': self.has_quick_guide,
            'has_instruction_manual': self.has_instruction_manual,
            'has_maintenance_protocol': self.has_maintenance_protocol,
            'metrology_frequency': self.metrology_frequency,
            'maintenance_required': self.maintenance_required,
            'maintenance_frequency': self.maintenance_frequency,
            'last_maintenance_date': _date_to_iso(self.last_maintenance_date),
            'calibration_required': self.calibration_required,
            'calibration_frequency': self.calibration_frequency,
            'last_calibration_date': _date_to_iso(self.last_calibration_date),
            'magnitude': self.magnitude,
            'measurement_range': self.measurement_range,
            'resolution': self.resolution,
            'work_range': self.work_range,
            'max_permitted_error': self.max_permitted_error,
            'voltage': self.voltage,
            'current': self.current,
            'relative_humidity': self.relative_humidity,
            'operating_temperature': self.operating_temperature,
            'dimensions': self.dimensions,
            'weight': self.weight,
            'others': self.others,
            'display': str(self),
        }

    def get_full_description(self):
        """Return a multi-line human readable description useful for debugging."""
        data = self.as_dict()
        lines = [f"{k}: {v}" for k, v in data.items()]
        return "\n".join(lines)

class EquipoDocumento(models.Model):
    equipo = models.ForeignKey(Equipos, on_delete=models.CASCADE, related_name='documentos')
    nombre = models.CharField(max_length=100)
    archivo = models.FileField(upload_to='documentos_equipos/')
    fecha_subida = models.DateTimeField(auto_now_add=True)


