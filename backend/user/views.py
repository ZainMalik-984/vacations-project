from user.serializer import registrationUserSerializer, CustomTokenObtainPairSerializer, RegistrationAdminSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomUser, PasswordResetOTP
from vacation_app.permission import IsAdmin
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
import random

# Create your views here.

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = registrationUserSerializer
    permission_classes = [IsAdmin]

    def post(self,req):
        print(req.data)
    
class registationAdminView(APIView):
    def post(self,req):
        serializer_obj = RegistrationAdminSerializer(data = req.data)
        if serializer_obj.is_valid():
            serializer_obj.save()
            return Response({'message': 'user created succesfully'}, status = status.HTTP_201_CREATED)
        return Response(serializer_obj.errors, status=status.HTTP_400_BAD_REQUEST)
    
class loginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        access = serializer.validated_data['access']
        refresh = serializer.validated_data['refresh']

        res = Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        res.data['user'] = serializer.validated_data['user']


        res.set_cookie(
            key='access',
            value=access,
            httponly=True,
            secure=True,
            samesite="None",
            max_age=300
        )
        res.set_cookie(
            key='refresh',
            value=refresh,
            httponly=True,
            secure=True,
            samesite="None",
            max_age=86400
        )

        return res


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if not refresh_token:
            raise AuthenticationFailed('No refresh token provided')

        serializer = self.get_serializer(data={'refresh': refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            raise AuthenticationFailed('Invalid refresh token')

        access = serializer.validated_data.get('access')
        refresh = serializer.validated_data.get('refresh')

        response = Response({'detail': 'Tokens refreshed'}, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access',
            value=access,
            httponly=True,
            secure=True,   
            samesite="None",
            max_age=60 * 5    
        )

        if refresh:
            response.set_cookie(
                key='refresh',
                value=refresh,
                httponly=True,
                secure=True,
                samesite="None",
                max_age=60 * 60 * 24 
            )

        return response

class logoutView(APIView):
    def post(self, req , *args, **kwargs):
        res = Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        res.delete_cookie('access', samesite='None')
        res.delete_cookie('refresh', samesite='None')
        return res
    
class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = CustomUser.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:5173/reset-password/{uid}/{token}/"  # Your React frontend route

            send_mail(
                'Password Reset',
                f'Click to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            return Response({'message': 'Reset link sent to email'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'No user with this email'}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetConfirmView(APIView):
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('password')

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)

            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
        

class SendOTPResetView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = CustomUser.objects.get(email=email)
            code = f"{random.randint(100000, 999999)}"

            PasswordResetOTP.objects.update_or_create(user=user, defaults={"code": code})

            send_mail(
                'Your OTP for Password Reset',
                f'Your OTP is: {code}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({'message': 'OTP sent to email'}, status=200)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Email not found'}, status=404)

class ResetPasswordWithOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        password = request.data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
            record = PasswordResetOTP.objects.get(user=user, code=otp)

            if not record.is_valid():
                return Response({'error': 'OTP expired'}, status=400)

            user.set_password(password)
            user.save()
            record.delete()

            return Response({'message': 'Password reset successful'}, status=200)

        except (CustomUser.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({'error': 'Invalid OTP or email'}, status=400)
