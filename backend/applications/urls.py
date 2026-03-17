from django.urls import path

from .views import ApproveApplicationView, DeclineApplicationView, ListApplicationView, SubmitApplicationView


urlpatterns = [
    path('apply/', SubmitApplicationView.as_view(), name='applications-apply'),
    path('list/', ListApplicationView.as_view(), name='applications-list'),
    path('<int:pk>/approve/', ApproveApplicationView.as_view(), name='applications-approve'),
    path('<int:pk>/decline/', DeclineApplicationView.as_view(), name='applications-decline'),
]
