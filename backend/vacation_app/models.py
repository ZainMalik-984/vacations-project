from django.db import models
from django.conf import settings

class Vacation(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.start_date} to {self.end_date} - {self.reason}"

