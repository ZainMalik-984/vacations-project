from django.db import models

class ClassSession(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField()
    is_suspended = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.date} ({'Suspended' if self.is_suspended else 'Active'})"
