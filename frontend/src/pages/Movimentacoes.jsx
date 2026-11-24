import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { Badge, dataCurta } from '../ui.jsx'

export default function Movimentacoes() {
  const [lista, setLista] = useState(null)

  useEffect(() => {
    api.get('/movimentacoes/').then(setLista)
  }, [])

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Entradas e saídas</h1>
          <p className="muted">Histórico de movimentações</p>
        </div>
        <div className="acoes">
          <Link className="btn primario" to="/movimentacoes/nova">+ Nova movimentação</Link>
        </div>
      </div>
      <div className="card">
        {!lista ? (
          <div className="carregando">Carregando...</div>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>Data</th><th>Produto</th><th>Tipo</th><th className="dir">Quantidade</th></tr>
            </thead>
            <tbody>
              {lista.map((m) => (
                <tr key={m.id}>
                  <td>{dataCurta(m.criada_em)}</td>
                  <td><strong>{m.produto}</strong> <span className="muted pequeno">{m.sku}</span></td>
                  <td><Badge tipo={m.tipo} /></td>
                  <td className="dir">{m.quantidade}</td>
                </tr>
              ))}
              {lista.length === 0 && <tr><td colSpan="4" className="vazio">Nenhuma movimentação ainda.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
