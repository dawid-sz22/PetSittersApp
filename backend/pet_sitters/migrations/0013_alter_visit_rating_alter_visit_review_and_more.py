# Generated by Django 5.1.1 on 2024-10-20 15:39

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pet_sitters', '0012_visit_is_over'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visit',
            name='rating',
            field=models.IntegerField(blank=True, default=1, validators=[django.core.validators.MaxValueValidator(5), django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='visit',
            name='review',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='visit',
            name='visit_notes',
            field=models.TextField(blank=True),
        ),
    ]
