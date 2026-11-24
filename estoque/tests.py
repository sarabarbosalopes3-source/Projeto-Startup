import json

from django.test import TestCase

from .models import Produto


class EstoqueTests(TestCase):
    def setUp(self):
        self.produto = Produto.objects.create(nome='Caixa', sku='CX1', saldo=10)

    def mover(self, tipo, quantidade):
        return self.client.post(
            '/api/movimentacoes/',
            json.dumps({'produto': self.produto.pk, 'tipo': tipo, 'quantidade': quantidade}),
            content_type='application/json',
        )

    def test_entrada_soma(self):
        self.assertEqual(self.mover('entrada', 5).status_code, 201)
        self.produto.refresh_from_db()
        self.assertEqual(self.produto.saldo, 15)

    def test_saida_subtrai(self):
        self.mover('saida', 4)
        self.produto.refresh_from_db()
        self.assertEqual(self.produto.saldo, 6)

    def test_saida_maior_que_saldo_recusada(self):
        r = self.mover('saida', 99)
        self.assertEqual(r.status_code, 400)
        self.produto.refresh_from_db()
        self.assertEqual(self.produto.saldo, 10)

    def test_api_e_front(self):
        for url in ['/api/dashboard/', '/api/produtos/', '/api/movimentacoes/', '/', '/inventario']:
            self.assertEqual(self.client.get(url).status_code, 200)

    def test_novo_produto(self):
        r = self.client.post('/api/produtos/', json.dumps({'nome': 'Fita', 'sku': 'F1', 'saldo': 3, 'estoque_minimo': 1}),
                             content_type='application/json')
        self.assertEqual(r.status_code, 201)
