from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'register', views.AdminUserViewSet, basename='register')

registrationRoutes = router.urls

urlpatterns = [
    path('', include(registrationRoutes) ),
    path('register/admin/', view = views.registationAdminView.as_view() ),
    path('login/', view= views.loginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', view= views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', view= views.logoutView.as_view() ),
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('password-reset-code/', views.SendOTPResetView.as_view(), name='send-otp'),
    path('password-reset-verify/', views.ResetPasswordWithOTPView.as_view(), name='verify-otp'),
]
