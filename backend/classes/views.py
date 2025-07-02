from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ClassSession
from .serializer import ClassSessionSerializer
from vacation_app.permission import IsAdmin, IsAdminOrTeacherOrStudent

class ClassSessionListCreateView(viewsets.ModelViewSet):
    queryset = ClassSession.objects.all()
    serializer_class = ClassSessionSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsAdmin()]
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated(), IsAdminOrTeacherOrStudent()]
