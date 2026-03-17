from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer


User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'status': 'success',
                'message': 'Account created successfully.',
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'status': 'success', 'user': UserSerializer(request.user).data})


class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'status': 'error', 'message': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        users = User.objects.all().order_by('first_name', 'last_name', 'email')
        return Response({'status': 'success', 'users': UserSerializer(users, many=True).data})


class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'status': 'error', 'message': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        email = (request.data.get('email') or '').strip().lower()
        first_name = (request.data.get('first_name') or '').strip()
        last_name = (request.data.get('last_name') or '').strip()

        if not email or not first_name or not last_name:
            return Response({'status': 'error', 'message': 'First name, last name, and email are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(~Q(id=target_user.id), email__iexact=email).exists():
            return Response({'status': 'error', 'message': 'Another account already uses this email.'}, status=status.HTTP_400_BAD_REQUEST)

        target_user.email = email
        target_user.first_name = first_name
        target_user.last_name = last_name
        target_user.save(update_fields=['email', 'first_name', 'last_name'])

        return Response({'status': 'success', 'message': 'User updated successfully.', 'user': UserSerializer(target_user).data})

    def delete(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'status': 'error', 'message': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if target_user.id == request.user.id:
            return Response({'status': 'error', 'message': 'Admin cannot delete their own account.'}, status=status.HTTP_400_BAD_REQUEST)

        target_user.delete()
        return Response({'status': 'success', 'message': 'User deleted successfully.'})


class ApplySellerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.role == 'admin':
            return Response({'status': 'error', 'message': 'Admin accounts cannot apply as sellers.'}, status=status.HTTP_400_BAD_REQUEST)
        if user.role == 'seller':
            return Response({'status': 'error', 'message': 'This account is already approved as a seller.'}, status=status.HTTP_400_BAD_REQUEST)
        if user.seller_application_status == 'pending':
            return Response({'status': 'error', 'message': 'A seller application is already pending.'}, status=status.HTTP_400_BAD_REQUEST)

        user.seller_application_status = 'pending'
        user.seller_application_reason = ''
        user.save(update_fields=['seller_application_status', 'seller_application_reason'])

        return Response(
            {
                'status': 'success',
                'message': 'Seller application submitted successfully.',
                'user': UserSerializer(user).data,
            }
        )


class AdminSellerApplicationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'status': 'error', 'message': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        users = User.objects.filter(seller_application_status='pending').order_by('first_name', 'last_name', 'email')
        return Response({'status': 'success', 'applications': UserSerializer(users, many=True).data})


class AdminSellerApproveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'status': 'error', 'message': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        merchant_id = (request.data.get('merchant_id') or '').strip()
        if not merchant_id:
            return Response({'status': 'error', 'message': 'Merchant ID is required for approval.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        user.role = 'seller'
        user.seller_application_status = 'approved'
        user.seller_application_reason = ''
        user.merchant_id = merchant_id
        user.save(update_fields=['role', 'seller_application_status', 'seller_application_reason', 'merchant_id'])

        return Response({'status': 'success', 'message': 'Seller application approved.', 'user': UserSerializer(user).data})


class AdminSellerDeclineView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'status': 'error', 'message': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        decline_reason = (request.data.get('decline_reason') or '').strip()
        if not decline_reason:
            return Response({'status': 'error', 'message': 'Decline reason is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        user.role = 'user'
        user.seller_application_status = 'declined'
        user.seller_application_reason = decline_reason
        user.merchant_id = ''
        user.save(update_fields=['role', 'seller_application_status', 'seller_application_reason', 'merchant_id'])

        return Response({'status': 'success', 'message': 'Seller application declined.', 'user': UserSerializer(user).data})
