from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            'Additional Info',
            {
                'fields': (
                    'phone_number',
                    'location',
                    'gender',
                    'role',
                    'merchant_id',
                    'seller_application_status',
                    'seller_application_reason',
                )
            },
        ),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            'Additional Info',
            {
                'fields': (
                    'email',
                    'phone_number',
                    'location',
                    'gender',
                    'role',
                    'merchant_id',
                    'seller_application_status',
                    'seller_application_reason',
                )
            },
        ),
    )
    list_display = ('id', 'email', 'username', 'first_name', 'last_name', 'role', 'seller_application_status', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('id',)
