from django.db import models

# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=200, verbose_name='Titulo')
    description = models.TextField(verbose_name='Descripcion')
    imagen = models.ImageField(verbose_name='Imagen', upload_to= 'project')
    infor = models.URLField(max_length=200, blank=True, verbose_name='Informacion')
    created = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creacion')
    update = models.DateTimeField(auto_now=True, verbose_name='Fecha de Edicion')

    class Meta:
        verbose_name = 'proyecto'
        verbose_name_plural = 'proyectos'
        ordering = ["-created"]
    def __str__(self):
        return self.title