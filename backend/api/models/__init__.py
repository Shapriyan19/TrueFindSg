from django.db import models

class UserProfile(models.Model):
    uid = models.CharField(max_length=128, unique=True)  # Firebase UID
    email = models.EmailField()
    username = models.CharField(max_length=100)
    profile_pic = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.username

class Product(models.Model):
    name = models.CharField(max_length=255)
    platform = models.CharField(max_length=50)
    price = models.CharField(max_length=20)
    verification_status = models.CharField(max_length=50)
    image_url = models.URLField()

    def __str__(self):
        return self.name 