from django.db import models

# Create your models here.

class Players(models.Model):
    name = models.CharField(max_length=255)
    number = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    team = models.CharField(max_length=255)