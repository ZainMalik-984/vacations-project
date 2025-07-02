from .models import Vacation
from rest_framework import serializers

class VacationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacation
        fields = '__all__'
        read_only_fields = ['created_at']
