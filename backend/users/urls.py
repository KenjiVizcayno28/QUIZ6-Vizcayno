from django.urls import path

from .views import (
    AdminSellerApplicationListView,
    AdminSellerApproveView,
    AdminSellerDeclineView,
    AdminUserDetailView,
    AdminUserListView,
    ApplySellerView,
    MyTokenObtainPairView,
    RegisterView,
    UserProfileView,
)


urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='users-login'),
    path('register/', RegisterView.as_view(), name='users-register'),
    path('profile/', UserProfileView.as_view(), name='users-profile'),
    path('admin/users/', AdminUserListView.as_view(), name='users-admin-list'),
    path('admin/users/<int:user_id>/', AdminUserDetailView.as_view(), name='users-admin-detail'),
    path('apply-seller/', ApplySellerView.as_view(), name='users-apply-seller'),
    path('admin/seller-applications/', AdminSellerApplicationListView.as_view(), name='users-admin-seller-list'),
    path('admin/seller-applications/<int:user_id>/approve/', AdminSellerApproveView.as_view(), name='users-admin-seller-approve'),
    path('admin/seller-applications/<int:user_id>/decline/', AdminSellerDeclineView.as_view(), name='users-admin-seller-decline'),
]
