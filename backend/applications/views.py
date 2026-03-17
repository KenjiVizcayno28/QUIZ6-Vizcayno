from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers import UserSerializer

from .models import SellerApplication
from .serializers import SellerApplicationSerializer


class SubmitApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.role == 'admin':
            return Response({'status': 'error', 'message': 'Admin accounts cannot apply as sellers.'}, status=status.HTTP_400_BAD_REQUEST)
        if user.role == 'seller':
            return Response({'status': 'error', 'message': 'This account is already approved as a seller.'}, status=status.HTTP_400_BAD_REQUEST)

        application, created = SellerApplication.objects.get_or_create(user=user)

        if not created and application.status == 'pending':
            return Response({'status': 'error', 'message': 'A seller application is already pending.'}, status=status.HTTP_400_BAD_REQUEST)

        application.status = 'pending'
        application.decline_reason = ''
        application.save(update_fields=['status', 'decline_reason'])

        user.seller_application_status = 'pending'
        user.seller_application_reason = ''
        user.save(update_fields=['seller_application_status', 'seller_application_reason'])

        return Response(
            {
                'status': 'success',
                'message': 'Seller application submitted successfully.',
                'user': UserSerializer(user).data,
                'application': SellerApplicationSerializer(application).data,
            }
        )


class ListApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'status': 'error', 'message': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        applications = SellerApplication.objects.select_related('user').filter(status='pending').order_by('created_at')
        return Response({'status': 'success', 'applications': SellerApplicationSerializer(applications, many=True).data})


class ApproveApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'admin':
            return Response({'status': 'error', 'message': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        merchant_id = (request.data.get('merchant_id') or '').strip()
        if not merchant_id:
            return Response({'status': 'error', 'message': 'Merchant ID is required for approval.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            application = SellerApplication.objects.select_related('user').get(pk=pk)
        except SellerApplication.DoesNotExist:
            return Response({'status': 'error', 'message': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = application.user
        application.status = 'approved'
        application.decline_reason = ''
        application.save(update_fields=['status', 'decline_reason'])

        user.role = 'seller'
        user.merchant_id = merchant_id
        user.seller_application_status = 'approved'
        user.seller_application_reason = ''
        user.save(update_fields=['role', 'merchant_id', 'seller_application_status', 'seller_application_reason'])

        return Response(
            {
                'status': 'success',
                'message': 'Seller application approved.',
                'user': UserSerializer(user).data,
                'application': SellerApplicationSerializer(application).data,
            }
        )


class DeclineApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.role != 'admin':
            return Response({'status': 'error', 'message': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        decline_reason = (request.data.get('decline_reason') or '').strip()
        if not decline_reason:
            return Response({'status': 'error', 'message': 'Decline reason is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            application = SellerApplication.objects.select_related('user').get(pk=pk)
        except SellerApplication.DoesNotExist:
            return Response({'status': 'error', 'message': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = application.user
        application.status = 'declined'
        application.decline_reason = decline_reason
        application.save(update_fields=['status', 'decline_reason'])

        user.role = 'user'
        user.merchant_id = ''
        user.seller_application_status = 'declined'
        user.seller_application_reason = decline_reason
        user.save(update_fields=['role', 'merchant_id', 'seller_application_status', 'seller_application_reason'])

        return Response(
            {
                'status': 'success',
                'message': 'Seller application declined.',
                'user': UserSerializer(user).data,
                'application': SellerApplicationSerializer(application).data,
            }
        )
