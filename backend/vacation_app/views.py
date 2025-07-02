from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mass_mail
from django.contrib.auth import get_user_model
from .models import Vacation
from .serializer import VacationSerializer
from .permission import IsAdmin, IsAdminOrTeacherOrStudent

User = get_user_model()

class VacationViewSet(viewsets.ModelViewSet):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated(), IsAdminOrTeacherOrStudent()]

    def perform_create(self, serializer):
        vacation = serializer.save()
        self.send_vacation_email(vacation)

    def send_vacation_email(self, vacation):
        users = User.objects.filter(role__in=['teacher', 'student'])
        emails = [user.email for user in users if user.email]

        if not emails:
            return  # No recipients

        subject = "📢 New Vacation Announced"
        message = (
            f"Dear User,\n\n"
            f"A new vacation has been announced from {vacation.start_date} to {vacation.end_date}.\n"
            f"Reason: {vacation.reason}\n\n"
            f"Best regards,\nAdmin Team"
        )

        messages = [(subject, message, None, [email]) for email in emails]
        send_mass_mail(messages, fail_silently=False)
