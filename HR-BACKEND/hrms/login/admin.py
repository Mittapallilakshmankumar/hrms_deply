from django.contrib import admin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'user')   # columns shown
    search_fields = ('name', 'phone', 'user__email') # search option
    list_filter = ('user',)                          # filter option

admin.site.register(Profile, ProfileAdmin)



