from django.urls import path

from . import views

urlpatterns = [
path('dashboard/', views.dashboard),
path('produtos/', views.produtos),
path('movimentacoes/', views.movimentacoes),
path('assistente/', views.assistente_ia, name='assistente_ia'),
]