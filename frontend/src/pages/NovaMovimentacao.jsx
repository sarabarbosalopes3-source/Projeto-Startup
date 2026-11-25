import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { Icon } from '../ui.jsx'

export default function NovaMovimentacao() {
  const navigate = useNavigate()
  const [produtos, setProdutos] = useState([])
  const [f, setF] = useState({ produto: '', tipo: 'entrada', quantidade: 1 })
  const [erros, setErros] = useState({})

  useEffect(() => {
    api.get('/produtos/').then((lista) => {
      setProdutos(lista)
      if (lista[0]) setF((atual) => ({ ...atual, produto: lista[0].id }))
    })
  }, [])

  const mudar = (campo) => (e) => setF({ ...f, [campo]: e.target.value })

  const salvar = (e) => {
    e.preventDefault()
    api.post('/movimentacoes/', f).then(() => navigate('/movimentacoes')).catch(setErros)
  }

  const erro = (nome) => erros[nome] && <span className="erro">{erros[nome].join(' ')}</span>

  return (
    <>
      <Link className="voltar" to="/movimentacoes"><Icon name="back" size={14} /> Voltar</Link>
      <div className="page-header"><h1>Nova movimentação</h1></div>
      <form className="card form-card" onSubmit={salvar}>
        {erros.__all__ && <div className="erros">{erros.__all__.join(' ')}</div>}
        <div className="field">
          <label className="field-label">Produto</label>
          <select value={f.produto} onChange={mudar('produto')}>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome} ({p.sku}) — saldo {p.saldo}</option>
            ))}
          </select>
          {erro('produto')}
        </div>
        <div className="field">
          <label className="field-label">Tipo</label>
          <select value={f.tipo} onChange={mudar('tipo')}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">Quantidade</label>
          <input type="number" min="1" value={f.quantidade} onChange={mudar('quantidade')} />
          {erro('quantidade')}
        </div>
        <div className="rodape-form">
          <Link className="btn" to="/movimentacoes">Cancelar</Link>
          <button className="btn primario" type="submit">Salvar</button>
        </div>
      </form>
    </>
  )
}
