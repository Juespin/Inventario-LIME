from rest_framework import serializers
from .models import Equipos
from responsables.serializers import ResponsablesSerializer
from sedes.serializers import SedesSerializer
from servicios.serializers import ServiciosSerializer

class EquiposSerializer(serializers.ModelSerializer):
    # Provide safe defaults for fields that are non-null at DB level so
    # serializers won't accidentally pass `None` (which would cause a DB
    # integrity error). These defaults avoid server 500 errors when the
    # frontend omits checkbox fields (unchecked checkboxes are often
    # omitted in the payload) or other optional numbers are missing.
    in_warranty = serializers.BooleanField(required=False, default=False)
    has_life_sheet = serializers.BooleanField(required=False, default=False)
    has_import_registration = serializers.BooleanField(required=False, default=False)
    has_operation_manual = serializers.BooleanField(required=False, default=False)
    has_maintenance_manual = serializers.BooleanField(required=False, default=False)
    has_quick_guide = serializers.BooleanField(required=False, default=False)
    has_instruction_manual = serializers.BooleanField(required=False, default=False)
    has_maintenance_protocol = serializers.BooleanField(required=False, default=False)
    maintenance_required = serializers.BooleanField(required=False, default=False)
    calibration_required = serializers.BooleanField(required=False, default=False)

    # Integer fields which don't accept NULL in the DB should also get a safe
    # numeric default when the frontend sends nothing.
    useful_life = serializers.IntegerField(required=False, default=0)
    maintenance_frequency = serializers.IntegerField(required=False, default=0)
    calibration_frequency = serializers.IntegerField(required=False, default=0)
    responsible_details = ResponsablesSerializer(source='responsible', read_only=True)
    site_details = SedesSerializer(source='site', read_only=True)
    service_details = ServiciosSerializer(source='service', read_only=True)
    display = serializers.CharField(source='__str__', read_only=True)
    full = serializers.SerializerMethodField()

    class Meta:
        model = Equipos
        fields = [
            'id', 'inventory_code', 'name', 'brand', 'model', 'serial', 'status',
            'site', 'service',
            'ips_code', 'ecri_code', 'responsible',
            'physical_location', 'misional_classification', 'ips_classification', 'risk_classification',
            'invima_record', 'useful_life', 'acquisition_date', 'owner', 'fabrication_date',
            'nit', 'provider', 'in_warranty', 'warranty_end_date', 'acquisition_method',
            'document_type', 'document_number', 'purchase_value',
            'has_life_sheet', 'has_import_registration', 'has_operation_manual', 'has_maintenance_manual',
            'has_quick_guide', 'has_instruction_manual', 'has_maintenance_protocol',
            'metrology_frequency', 'maintenance_required', 'maintenance_frequency', 'last_maintenance_date',
            'calibration_required', 'calibration_frequency', 'last_calibration_date', 'magnitude', 'measurement_range', 'resolution',
            'work_range', 'max_permitted_error', 'voltage', 'current', 'relative_humidity',
            'operating_temperature', 'dimensions', 'weight', 'others',
            'site_details', 'service_details', 'responsible_details', 'display', 'full'
        ]
        read_only_fields = ['id', 'display', 'full']
        extra_kwargs = {
            # accept partial payloads from the frontend; DB-level integrity still applies
            'misional_classification': {'required': False, 'allow_blank': True},
            'ips_classification': {'required': False, 'allow_blank': True},
            'risk_classification': {'required': False, 'allow_blank': True},
            'invima_record': {'required': False, 'allow_blank': True},
            'useful_life': {'required': False, 'allow_null': True},
            'acquisition_date': {'required': False, 'allow_null': True},
            'owner': {'required': False, 'allow_blank': True},
            'fabrication_date': {'required': False, 'allow_null': True},
            'nit': {'required': False, 'allow_blank': True},
            'provider': {'required': False, 'allow_blank': True},
            'in_warranty': {'required': False, 'allow_null': True},
            'warranty_end_date': {'required': False, 'allow_null': True},
            'acquisition_method': {'required': False, 'allow_blank': True},
            'document_type': {'required': False, 'allow_blank': True},
            'document_number': {'required': False, 'allow_blank': True},
            'purchase_value': {'required': False, 'allow_blank': True},
            'has_life_sheet': {'required': False, 'allow_null': True},
            'has_import_registration': {'required': False, 'allow_null': True},
            'has_operation_manual': {'required': False, 'allow_null': True},
            'has_maintenance_manual': {'required': False, 'allow_null': True},
            'has_quick_guide': {'required': False, 'allow_null': True},
            'has_instruction_manual': {'required': False, 'allow_null': True},
            'has_maintenance_protocol': {'required': False, 'allow_null': True},
            'metrology_frequency': {'required': False, 'allow_blank': True},
            'maintenance_required': {'required': False, 'allow_null': True},
            'maintenance_frequency': {'required': False, 'allow_null': True},
            'last_maintenance_date': {'required': False, 'allow_null': True},
            'calibration_required': {'required': False, 'allow_null': True},
            'calibration_frequency': {'required': False, 'allow_null': True},
            'last_calibration_date': {'required': False, 'allow_null': True},
            'magnitude': {'required': False, 'allow_blank': True},
            'measurement_range': {'required': False, 'allow_blank': True},
            'resolution': {'required': False, 'allow_blank': True},
            'work_range': {'required': False, 'allow_blank': True},
            'max_permitted_error': {'required': False, 'allow_blank': True},
            'voltage': {'required': False, 'allow_blank': True},
            'current': {'required': False, 'allow_blank': True},
            'relative_humidity': {'required': False, 'allow_blank': True},
            'operating_temperature': {'required': False, 'allow_blank': True},
            'dimensions': {'required': False, 'allow_blank': True},
            'weight': {'required': False, 'allow_blank': True},
            'others': {'required': False, 'allow_blank': True},
        }

    def get_full(self, obj):
        return obj.as_dict()