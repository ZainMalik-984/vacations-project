from rest_framework.routers import DefaultRouter
from .views import VacationViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'vacations', VacationViewSet, basename='vacation')

vacationRoutes = router.urls

urlpatterns = [
    path('', include(vacationRoutes)),
]
