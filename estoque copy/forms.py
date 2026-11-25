from django import forms

from .models import Movimentacao, Produto


class ProdutoForm(forms.ModelForm):
    class Meta:
        model = Produto
        fields = ['nome', 'sku', 'saldo', 'estoque_minimo']


class MovimentacaoForm(forms.ModelForm):
    class Meta:
        model = Movimentacao
        fields = ['produto', 'tipo', 'quantidade']

    def clean(self):
        dados = super().clean()
        produto = dados.get('produto')
        tipo = dados.get('tipo')
        quantidade = dados.get('quantidade')
        if produto and tipo == 'saida' and quantidade and quantidade > produto.saldo:
            raise forms.ValidationError(f'Saldo insuficiente: só tem {produto.saldo}.')
        if quantidade is not None and quantidade < 1:
            raise forms.ValidationError('A quantidade precisa ser maior que zero.')
        return dados

    def save(self, commit=True):
        mov = super().save(commit)
        produto = mov.produto
        produto.saldo += mov.quantidade if mov.tipo == 'entrada' else -mov.quantidade
        produto.save()
        return mov
