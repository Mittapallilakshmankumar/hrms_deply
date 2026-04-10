
# from django.urls import path
# from .views import add_candidate, get_candidates, delete_candidate, update_candidate, approve_candidate, dashboard,list_employees,exit_employee
# urlpatterns = [
#     path('add/', add_candidate),
#     path('list/', get_candidates),
#     path('delete/<int:id>/', delete_candidate),
#     path('update/<int:id>/', update_candidate),

#     # ✅ Keep only this
#     path('approve-candidate/<int:id>/', approve_candidate),

#     path('employees/<int:pk>/exit/', exit_employee),
    

#     path('dashboard/', dashboard),
#     path('employees/', list_employees),
# ]




from django.urls import path
from .views import add_candidate, get_candidates, delete_candidate, update_candidate, approve_candidate, dashboard,list_employees,exit_employee, employee_detail,upload_employee_file,get_all_files
urlpatterns = [
    path('add/', add_candidate),
    path('list/', get_candidates),
    path('delete/<int:id>/', delete_candidate),
    path('update/<int:id>/', update_candidate),

    # ✅ Keep only this
    path('approve-candidate/<int:id>/', approve_candidate),

    path('employees/<int:pk>/exit/', exit_employee),
    

    path('dashboard/', dashboard),
    path('employees/', list_employees),
    path('employees/<int:id>/', employee_detail),
    path("upload-file/", upload_employee_file),
    path("files/", get_all_files),
    
]

