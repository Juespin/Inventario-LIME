from django.db import models
from sedes.models import Sede
from servicios.models import Servicio
from responsables.models import Responsable

class Equipos(models.Model):
    codigo_udea= models.CharField(max_length=50, unique=True)
    nombre_equipo = models.CharField(max_length=100)
    marca = models.CharField(max_length=20)
    modelo = models.CharField(max_length=100)
    serie = models.CharField(max_length=100)
    estado= models.CharField(max_length=50)
    sede = models.ForeignKey(Sede, on_delete=models.CASCADE, related_name='equipos')
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='equipos')
    codigo_ips= models.CharField(max_length=50, unique=True)
    codigo_ecri = models.CharField(max_length=100)
    responsable_proceso = models.ForeignKey(Responsable, on_delete=models.CASCADE, related_name='equipos')
    ubicacion = models.CharField(max_length=200)
    clasificacion_misional = models.CharField(max_length=100)
    clasificacion_ips = models.CharField(max_length=100)
    clasificacion_riesgo = models.CharField(max_length=100)
    registro_invima = models.CharField(max_length=100)
    vida_util = models.IntegerField()
    fecha_adquisicion = models.DateField()
    propietario = models.CharField(max_length=100)
    fecha_fabricacion = models.DateField()
    nit= models.CharField(max_length=50)
    proveedor = models.CharField(max_length=100)
    garantia = models.BooleanField()
    finalizacion_garantia= models.DateField()
    forma_adquisicion= models.CharField(max_length=50)
    tipo_documento= models.CharField(max_length=50)
    numero_documento=models.CharField(max_length=50)
    valor_compra= models.CharField(max_length=50)
    hoja_de_vida=  models.BooleanField()
    registro_importacion=  models.BooleanField()
    manual_operacion=  models.BooleanField()
    manual_mantenimiento=  models.BooleanField()
    guia_rapida=  models.BooleanField()
    instructivo_de_manejo=  models.BooleanField()
    protocolo_mantenimiento=  models.BooleanField()
    frecuencia_metrologia= models.CharField(max_length=100)
    mantenimiento=  models.BooleanField()
    frecuencia_mantenimiento= models.IntegerField()
    calibracion=  models.BooleanField()
    frecuencia_calibracion= models.IntegerField()
    magnitud= models.CharField(max_length=100)
    rango_medicion= models.CharField(max_length=100)
    resolucion= models.CharField(max_length=100)
    rango_trabajo= models.CharField(max_length=100)
    error_maximo_permitido=  models.CharField(max_length=100)
    voltaje= models.CharField(max_length=50)
    corriente= models.CharField(max_length=50)
    humedad_relativa= models.CharField(max_length=50)
    temperatura_operacion= models.CharField(max_length=50)
    dimensiones= models.CharField(max_length=100)
    peso= models.CharField(max_length=50)
    otros= models.TextField() 

    

    def __str__(self):
        return f'{self.codigo_udea} - {self.nombre_equipo}'

    def as_dict(self):
        """Return a dict with useful fields for API/frontend consumption.

        Related objects are represented by their string form and their id.
        Dates are returned as ISO strings when present.
        """
        def _date_to_iso(d):
            return d.isoformat() if d is not None else None

        return {
            'id': self.id,
            'codigo_udea': self.codigo_udea,
            'nombre_equipo': self.nombre_equipo,
            'marca': self.marca,
            'modelo': self.modelo,
            'serie': self.serie,
            'sede_id': getattr(self, 'sede_id', None),
            'sede': str(self.sede) if self.sede_id else None,
            'servicio_id': getattr(self, 'servicio_id', None),
            'servicio': str(self.servicio) if self.servicio_id else None,
            'responsable_proceso_id': getattr(self, 'responsable_proceso_id', None),
            'responsable_proceso': str(self.responsable_proceso) if self.responsable_proceso_id else None,
            'ubicacion': self.ubicacion,
            'clasificacion_misional': self.clasificacion_misional,
            'clasificacion_ips': self.clasificacion_ips,
            'clasificacion_riesgo': self.clasificacion_riesgo,
            'registro_invima': self.registro_invima,
            'vida_util': self.vida_util,
            'fecha_adquisicion': _date_to_iso(self.fecha_adquisicion),
            'propietario': self.propietario,
            'fecha_fabricacion': _date_to_iso(self.fecha_fabricacion),
            'nit': self.nit,
            'proveedor': self.proveedor,
            'garantia': self.garantia,
            'finalizacion_garantia': _date_to_iso(self.finalizacion_garantia),
            'forma_adquisicion': self.forma_adquisicion,
            'tipo_documento': self.tipo_documento,
            'numero_documento': self.numero_documento,
            'valor_compra': self.valor_compra,
            'hoja_de_vida': self.hoja_de_vida,
            'registro_importacion': self.registro_importacion,
            'manual_operacion': self.manual_operacion,
            'manual_mantenimiento': self.manual_mantenimiento,
            'guia_rapida': self.guia_rapida,
            'instructivo_de_manejo': self.instructivo_de_manejo,
            'protocolo_mantenimiento': self.protocolo_mantenimiento,
            'frecuencia_metrologia': self.frecuencia_metrologia,
            'mantenimiento': self.mantenimiento,
            'frecuencia_mantenimiento': self.frecuencia_mantenimiento,
            'calibracion': self.calibracion,
            'frecuencia_calibracion': self.frecuencia_calibracion,
            'magnitud': self.magnitud,
            'rango_medicion': self.rango_medicion,
            'resolucion': self.resolucion,
            'rango_trabajo': self.rango_trabajo,
            'error_maximo_permitido': self.error_maximo_permitido,
            'voltaje': self.voltaje,
            'corriente': self.corriente,
            'humedad_relativa': self.humedad_relativa,
            'temperatura_operacion': self.temperatura_operacion,
            'dimensiones': self.dimensiones,
            'peso': self.peso,
            'otros': self.otros,
            'display': str(self),
        }

    def get_full_description(self):
        """Return a multi-line human readable description useful for debugging."""
        data = self.as_dict()
        lines = [f"{k}: {v}" for k, v in data.items()]
        return "\n".join(lines)
        

