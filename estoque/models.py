from django.db import models


class Produto(models.Model):
    nome = models.CharField(max_length=100)
    sku = models.CharField(max_length=30, unique=True)
    saldo = models.IntegerField(default=0)
    estoque_minimo = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.nome} ({self.sku})'

    @property
    def baixo(self):
        return self.saldo <= self.estoque_minimo


class Movimentacao(models.Model):
    TIPOS = [('entrada', 'Entrada'), ('saida', 'Saída')]

    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    tipo = models.CharField(max_length=10, choices=TIPOS)
    quantidade = models.PositiveIntegerField()
    criada_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-criada_em']

    def __str__(self):
        return f'{self.tipo} {self.quantidade} x {self.produto.sku}'
