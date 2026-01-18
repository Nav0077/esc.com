from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def players(request):
    return render(request, 'players.html')

def tournaments(request):
    return render(request, 'tournaments.html')

def my_matches(request):
    return render(request, 'matches.html')

def gallery(request):
    return render(request, 'gallery.html')

def stats(request):
    return render(request, 'stats.html')

def login(request):
    return render(request, 'login.html')

def register(request):
    return render(request, 'register.html')

