from django.shortcuts import render, HttpResponse

# Create your views here.

def home(request):
    return render(request, "core/home.html")

def contact(request):
    return render(request, "core/contacto.html")

def about(request):
    return render(request, "core/about.html")

def juego(request):
    return render(request, "core/juego.html")
    
def broma(request):
    return render(request, "core/broma.html")

def pregunta(request):
    return render(request, "core/pregunta.html")

def tres_en_raya(request):
    return render(request, "core/tres_en_raya.html")
    
def pregunta1(request):
    return render(request, "core/pregunta_V1.1.html")
