from django.contrib import admin

# Register your models here.

from .models import Players

@admin.register(Players)
class PlayersAdmin(admin.ModelAdmin):
    list_display = ('name', 'number', 'position', 'team')
    search_fields = ('name', 'number', 'position', 'team')
    list_filter = ('name', 'number', 'position', 'team')
