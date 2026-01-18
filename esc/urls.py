
from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('my-matches/', views.my_matches, name='my_matches'),
    path('tournaments/', views.tournaments, name='tournaments'),
    path('players/', views.players, name='players'),
    path('stats/', views.stats, name='stats'),
    path('gallery/', views.gallery, name='gallery'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
]
