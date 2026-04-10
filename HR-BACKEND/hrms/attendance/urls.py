from django.urls import path
from .views import check_in, check_out, attendance_list, admin_dashboard,admin_reset_password, attendance_by_date, attendance_by_month,auto_checkout_11pm

urlpatterns = [
    path('check-in/', check_in),
    path('check-out/', check_out),
    path('attendance/', attendance_list),
    path('admin-dashboard/', admin_dashboard),
    path('admin-reset-password/', admin_reset_password),
    path('by-date/', attendance_by_date),
    path('by-month/', attendance_by_month),
    path("auto-checkout-11pm/", auto_checkout_11pm),
]


