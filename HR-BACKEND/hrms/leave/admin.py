from django.contrib import admin
from .models import Leave


@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'employee_id',
        'department',
        'leave_type',
        'from_date',
        'to_date',
        'status'
    )

    list_filter = (
        'status',
        'leave_type',
        'department'
    )

    search_fields = (
        'name',
        'employee_id'
    )

    ordering = ('-from_date',)



    