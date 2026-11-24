import json

from django.db.models import F, Sum
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

    lista = Movimentacao.objects.select_related('produto')

    return JsonResponse(
        [mov_json(m) for m in lista],
        safe=False
    )

# FUNÇÃO DO ASSISTENTE DE IA
@csrf_exempt
def assistente_ia(request):

    if request.method != 'POST':
        return JsonResponse(
            {'erro': 'Método não permitido.'},
            status=405
        )

    dados = corpo(request)
    pergunta = dados.get('pergunta', '').strip()

    if not pergunta:
        return JsonResponse(
            {'erro': 'Digite uma pergunta.'},
            status=400
        )

    try:
        # Buscar todos os produtos cadastrados
        produtos = Produto.objects.all().order_by('nome')

        # Buscar as últimas 10 movimentações
        movimentacoes_recentes = (
            Movimentacao.objects
            .select_related('produto')
            .order_by('-criada_em')[:10]
        )

        # Organizar os dados dos produtos
        lista_produtos = []

        for p in produtos:
            lista_produtos.append({
                'nome': p.nome,
                'sku': p.sku,
                'saldo': p.saldo,
                'estoque_minimo': p.estoque_minimo,
                'situacao': (
                    'Sem estoque' if p.saldo <= 0
                    else 'Estoque baixo' if p.baixo
                    else 'Estoque normal'
                )
            })

        # Organizar as movimentações
        lista_movimentacoes = []

        for m in movimentacoes_recentes:
            lista_movimentacoes.append({
                'produto': m.produto.nome,
                'sku': m.produto.sku,
                'tipo': m.tipo,
                'quantidade': m.quantidade,
                'data': m.criada_em.strftime('%d/%m/%Y %H:%M')
            })

        # Montar o contexto com informações reais
        contexto = {
            'resumo': {
                'total_produtos': produtos.count(),

                'total_unidades': (
                    produtos.aggregate(t=Sum('saldo'))['t'] or 0
                ),

                'produtos_com_estoque_baixo': (
                    produtos.filter(
                        saldo__lte=F('estoque_minimo')
                    ).count()
                ),

                'total_entradas': Movimentacao.objects.filter(
                    tipo='entrada'
                ).count(),

                'total_saidas': Movimentacao.objects.filter(
                    tipo='saida'
                ).count()
            },

            'produtos': lista_produtos,

            'ultimas_movimentacoes': lista_movimentacoes
        }

        # Transformar os dados em texto JSON
        contexto_texto = json.dumps(
            contexto,
            ensure_ascii=False
        )

        # Enviar pergunta e dados para o Gemini
        resposta = perguntar_ao_gemini(
            pergunta,
            contexto_texto
        )

        return JsonResponse({
            'resposta': resposta
        })

    except Exception as e:
        return JsonResponse({
            'erro': str(e)
        }, status=502)