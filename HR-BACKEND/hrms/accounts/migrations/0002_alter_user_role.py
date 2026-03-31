# Compatibility bridge for Maker-Checker migration history.
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = []
