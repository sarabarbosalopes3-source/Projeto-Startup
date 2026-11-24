import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { Badge, dataCurta } from '../ui.jsx'

export default function Dashboard() {
  const [d, setD] = useState(null)

  useEffect(() => {
    api.get('/dashboard/').then(setD)
  }, [])

  if (!d) return <div className="carregando">Carregando...</div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Visão geral</h1>
          <p className="muted">Resumo do seu estoque</p>
        </div>
        <div className="acoes">
          <Link className="btn" to="/inventario/novo">Novo produto</Link>
          <Link className="btn primario" to="/movimentacoes/nova">Nova movimentação</Link>
        </div>
      </div>

      <div className="grid-4">
        <div className="kpi"><span className="muted pequeno upper">Produtos</span><strong>{d.total_produtos}</strong></div>
        <div className="kpi"><span className="muted pequeno upper">Unidades em estoque</span><strong>{d.total_unidades}</strong></div>
        <div className="kpi"><span className="muted pequeno upper">Entradas</span><strong className="verde-txt">{d.entradas}</strong></div>
        <div className="kpi"><span className="muted pequeno upper">Saídas</span><strong className="laranja-txt">{d.saidas}</strong></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Movimentações recentes</h3>
            <Link className="link-verde" to="/movimentacoes">Ver todas</Link>
          </div>
          <table className="tabela">
            <thead>
              <tr><th>Data</th><th>Produto</th><th>Tipo</th><th className="dir">Qtd</th></tr>
            </thead>
            <tbody>
              {d.recentes.map((m) => (
                <tr key={m.id}>
                  <td>{dataCurta(m.criada_em)}</td>
                  <td>{m.produto}</td>
                  <td><Badge tipo={m.tipo} /></td>
                  <td className="dir">{m.quantidade}</td>
                </tr>
              ))}
              {d.recentes.length === 0 && (
                <tr><td colSpan="4" className="vazio">Nenhuma movimentação ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-head">
            <h3>Estoque baixo</h3>
            <span className="pill">{d.baixos.length}</span>
          </div>
          {d.baixos.map((p) => (
            <div className="linha-baixo" key={p.id}>
              <div><strong>{p.nome}</strong><span className="muted pequeno">{p.sku}</span></div>
              <div className="dir">
                <strong className={p.saldo <= 0 ? 'vermelho-txt' : 'alerta'}>{p.saldo}</strong>
                <span className="muted pequeno">mín. {p.estoque_minimo}</span>
              </div>
            </div>
          ))}
          {d.baixos.length === 0 && <p className="vazio">Tudo certo por aqui.</p>}
        </div>
      </div>
    </>
  )
}
