from rest_framework import serializers

from users.serializers import UserSerializer

from .models import SellerApplication


class SellerApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SellerApplication
        fields = ['id', 'user', 'status', 'decline_reason', 'created_at']
