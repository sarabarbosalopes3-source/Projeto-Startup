import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { Badge } from '../ui.jsx'

export default function Produtos() {
  const [lista, setLista] = useState(null)

  useEffect(() => {
    api.get('/produtos/').then(setLista)
  }, [])

  const excluir = (p) => {
    if (!window.confirm(`Excluir o produto "${p.nome}"?`)) return
    api.delete(`/produtos/${p.id}/`)
      .then(() => setLista((l) => l.filter((x) => x.id !== p.id)))
      .catch((e) => window.alert(e.erro || 'Não foi possível excluir.'))
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Inventário</h1>
          <p className="muted">Todos os produtos cadastrados</p>
        </div>
        <div className="acoes">
          <Link className="btn primario" to="/inventario/novo">+ Novo produto</Link>
        </div>
      </div>
      <div className="card">
        {!lista ? (
          <div className="carregando">Carregando...</div>
        ) : (
          <table className="tabela">
            <thead>
              <tr><th>Produto</th><th>SKU</th><th className="dir">Saldo</th><th className="dir">Mínimo</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.nome}</strong></td>
                  <td className="muted">{p.sku}</td>
                  <td className="dir">{p.saldo}</td>
                  <td className="dir muted">{p.estoque_minimo}</td>
                  <td><Badge tipo={p.status} /></td>
                  <td className="acoes-linha"><button className="btn mini" onClick={() => excluir(p)}>Excluir</button></td>
                </tr>
              ))}
              {lista.length === 0 && <tr><td colSpan="6" className="vazio">Nenhum produto ainda.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
