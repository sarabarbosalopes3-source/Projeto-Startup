from django.urls import path

from . import views

urlpatterns = [
path('dashboard/', views.dashboard),
path('produtos/', views.produtos),
path('produtos/<int:pk>/', views.produto_detalhe),
path('movimentacoes/', views.movimentacoes),
path('movimentacoes/<int:pk>/', views.movimentacao_detalhe),
path('assistente/', views.assistente_ia, name='assistente_ia'),
]