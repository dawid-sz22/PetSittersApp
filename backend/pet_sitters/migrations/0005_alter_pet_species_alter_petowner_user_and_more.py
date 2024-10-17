# Generated by Django 5.1.1 on 2024-10-17 14:22

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pet_sitters', '0004_pet_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pet',
            name='species',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='pet_sitters.petspecies'),
        ),
        migrations.AlterField(
            model_name='petowner',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='petsitter',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='pet_sitters', to=settings.AUTH_USER_MODEL),
        ),
    ]
