from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ClassSessionListCreateView

router = DefaultRouter()
router.register(r'classes', ClassSessionListCreateView, basename='classes')

classesRoutes = router.urls

urlpatterns = [
    path('', include(classesRoutes)),
]