# Generated by Django 3.0.7 on 2020-07-16 03:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='text',
        ),
        migrations.AddField(
            model_name='project',
            name='infor',
            field=models.URLField(blank=True),
        ),
    ]