from django.urls import path
from .views import JobListCreate, RegisterView, LoginView, ProtectedView
from .views import ProfileView

urlpatterns = [
    path('jobs/', JobListCreate.as_view(), name='job-list'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('profile/', ProfileView.as_view(), name='profile'),
]