# Compatibility bridge for Maker-Checker migration history.
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("finance", "0002_auditlog"),
    ]

    operations = []
