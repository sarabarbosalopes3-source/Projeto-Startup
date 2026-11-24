import React from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { Icon } from './ui.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Produtos from './pages/Produtos.jsx'
import NovoProduto from './pages/NovoProduto.jsx'
import Movimentacoes from './pages/Movimentacoes.jsx'
import NovaMovimentacao from './pages/NovaMovimentacao.jsx'
import Assistente from './pages/Assistente.jsx'

const MIGALHAS = [
  [/^\/assistente/, ['Assistente IA']],
  [/^\/inventario\/novo/, ['Inventário', 'Novo produto']],
  [/^\/inventario/, ['Inventário']],
  [/^\/movimentacoes\/nova/, ['Entradas e saídas', 'Nova movimentação']],
  [/^\/movimentacoes/, ['Entradas e saídas']],
  [/^\//, ['Visão geral']],
]

const NAV = [
  ['/', 'Visão geral', 'grid', true],
  ['/inventario', 'Inventário', 'box'],
  ['/movimentacoes', 'Entradas e saídas', 'swap'],
]

export default function App() {
  const { pathname } = useLocation()
  const migalhas = MIGALHAS.find(([re]) => re.test(pathname))[1]

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">
            <Icon name="logo" size={20} />
          </span>
Controle de Estoque
        </div>

        <div className="side-label">PRINCIPAL</div>

        <nav>
          {NAV.map(([to, texto, icone, end]) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'ativo' : '')}
            >
              <Icon name={icone} /> {texto}
            </NavLink>
          ))}

          <NavLink
            to="/assistente"
            className={({ isActive }) => (isActive ? 'ativo' : '')}
          >
            <span className="ia-nav-icon">IA</span>
            Assistente IA
          </NavLink>
        </nav>

        <hr />

        <a className="nav-fake" href="/admin/" target="_blank" rel="noreferrer">
          <Icon name="gear" /> Configurações
        </a>

        <div className="side-fim">
          <div className="status-box">
            <strong>Operação em dia</strong>
            <span>
              <i /> Sistema sincronizado
            </span>
          </div>
        </div>
      </aside>

      <div className="conteudo">
        <header className="topbar">
          <div className="migalhas">
            <span className="muted">Operações</span>

            {migalhas.map((m, i) => (
              <span key={m}>
                <span className="muted"> / </span>
                <span className={i === migalhas.length - 1 ? 'atual' : ''}>
                  {m}
                </span>
              </span>
            ))}
          </div>

          <div className="topo-direita">
            <span className="centro-tag">
              <i /> Controle de Estoque

            </span>
          </div>
        </header>

        <main className="pagina">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Produtos />} />
            <Route path="/inventario/novo" element={<NovoProduto />} />
            <Route path="/movimentacoes" element={<Movimentacoes />} />
            <Route path="/movimentacoes/nova" element={<NovaMovimentacao />} />
            <Route path="/assistente" element={<Assistente />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
