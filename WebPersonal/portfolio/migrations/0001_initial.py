# Generated by Django 3.0.7 on 2020-07-16 02:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Titulo')),
                ('description', models.TextField(verbose_name='Descripcion')),
                ('text', models.CharField(max_length=300)),
                ('imagen', models.ImageField(upload_to='project', verbose_name='Imagen')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creacion')),
                ('update', models.DateTimeField(auto_now=True, verbose_name='Fecha de Edicion')),
            ],
            options={
                'verbose_name': 'proyecto',
                'verbose_name_plural': 'proyectos',
                'ordering': ['-created'],
            },
        ),
    ]
