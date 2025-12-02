from django.urls import path
from .views import (
    CurrentUserView,
    UserRegistrationView,
    CustomTokenObtainPairView
)

urlpatterns = [
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/register/', UserRegistrationView.as_view(), name='user-register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]


