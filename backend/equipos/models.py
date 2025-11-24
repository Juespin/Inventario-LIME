from django.db import models
from sedes.models import Sede
from servicios.models import Servicio
from responsables.models import Responsable

class Equipos(models.Model):
    # normalized field names to match frontend (english)
    inventory_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=20)
    model = models.CharField(max_length=100)
    serial = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    site = models.ForeignKey(Sede, on_delete=models.CASCADE, related_name='equipos')
    service = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='equipos')
    ips_code = models.CharField(max_length=50, unique=True)
    ecri_code = models.CharField(max_length=100)
    responsible = models.ForeignKey(Responsable, on_delete=models.CASCADE, related_name='equipos')
    physical_location = models.CharField(max_length=200)
    misional_classification = models.CharField(max_length=100)
    ips_classification = models.CharField(max_length=100)
    risk_classification = models.CharField(max_length=100)
    invima_record = models.CharField(max_length=100)
    useful_life = models.IntegerField()
    acquisition_date = models.DateField()
    owner = models.CharField(max_length=100)
    fabrication_date = models.DateField()
    nit= models.CharField(max_length=50)
    provider = models.CharField(max_length=100)
    in_warranty = models.BooleanField()
    warranty_end_date= models.DateField()
    acquisition_method= models.CharField(max_length=50)
    document_type= models.CharField(max_length=50)
    document_number=models.CharField(max_length=50)
    purchase_value= models.CharField(max_length=50)
    has_life_sheet=  models.BooleanField()
    has_import_registration=  models.BooleanField()
    has_operation_manual=  models.BooleanField()
    has_maintenance_manual=  models.BooleanField()
    has_quick_guide=  models.BooleanField()
    has_instruction_manual=  models.BooleanField()
    has_maintenance_protocol=  models.BooleanField()
    metrology_frequency= models.CharField(max_length=100)
    maintenance_required=  models.BooleanField()
    maintenance_frequency= models.IntegerField()
    calibration_required=  models.BooleanField()
    calibration_frequency= models.IntegerField()
    magnitude= models.CharField(max_length=100)
    measurement_range= models.CharField(max_length=100)
    resolution= models.CharField(max_length=100)
    work_range= models.CharField(max_length=100)
    max_permitted_error=  models.CharField(max_length=100)
    voltage= models.CharField(max_length=50)
    current= models.CharField(max_length=50)
    relative_humidity= models.CharField(max_length=50)
    operating_temperature= models.CharField(max_length=50)
    dimensions= models.CharField(max_length=100)
    weight= models.CharField(max_length=50)
    others= models.TextField() 

    

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
            'calibration_required': self.calibration_required,
            'calibration_frequency': self.calibration_frequency,
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
        

