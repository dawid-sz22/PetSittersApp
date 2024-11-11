# Generated by Django 5.1.1 on 2024-10-21 13:13

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pet_sitters', '0014_alter_visit_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visit',
            name='rating',
            field=models.IntegerField(null=True, validators=[django.core.validators.MaxValueValidator(5), django.core.validators.MinValueValidator(1)]),
        ),
    ]
