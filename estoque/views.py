import json

from django.db.models import F, Sum
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .forms import MovimentacaoForm, ProdutoForm
from .models import Movimentacao, Produto
from .ia import perguntar_ao_gemini


def produto_json(p):
    if p.saldo <= 0:
        status = 'sem_estoque'
    elif p.baixo:
        status = 'baixo'
    else:
        status = 'em_estoque'

    return {
        'id': p.id,
        'nome': p.nome,
        'sku': p.sku,
        'saldo': p.saldo,
        'estoque_minimo': p.estoque_minimo,
        'status': status,
    }


def mov_json(m):
    return {
        'id': m.id,
        'produto': m.produto.nome,
        'sku': m.produto.sku,
        'tipo': m.tipo,
        'quantidade': m.quantidade,
        'criada_em': m.criada_em.isoformat(),
    }


def corpo(request):
    try:
        return json.loads(request.body or '{}')
    except ValueError:
        return {}


def erros(form):
    return JsonResponse(
        {k: list(v) for k, v in form.errors.items()},
        status=400
    )


def dashboard(request):
    produtos = Produto.objects.all()
    movs = Movimentacao.objects.all()

    return JsonResponse({
        'total_produtos': produtos.count(),
        'total_unidades': produtos.aggregate(t=Sum('saldo'))['t'] or 0,
        'entradas': movs.filter(tipo='entrada').count(),
        'saidas': movs.filter(tipo='saida').count(),
        'baixos': [
            produto_json(p)
            for p in produtos.filter(saldo__lte=F('estoque_minimo'))
        ],
        'recentes': [
            mov_json(m)
            for m in movs.select_related('produto')[:5]
        ],
    })


# FUNÇÃO DE PRODUTOS
@csrf_exempt
def produtos(request):
    if request.method == 'POST':
        form = ProdutoForm(corpo(request))

        if not form.is_valid():
            return erros(form)

        return JsonResponse(produto_json(form.save()), status=201)

    return JsonResponse(
        [produto_json(p) for p in Produto.objects.all()],
        safe=False
    )


# FUNÇÃO DE MOVIMENTAÇÕES
@csrf_exempt
def movimentacoes(request):
    if request.method == 'POST':
        form = MovimentacaoForm(corpo(request))

        if not form.is_valid():
            return erros(form)

        return JsonResponse(mov_json(form.save()), status=201)