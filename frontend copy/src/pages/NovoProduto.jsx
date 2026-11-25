import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { Icon } from '../ui.jsx'

export default function NovoProduto() {
  const navigate = useNavigate()
  const [f, setF] = useState({ nome: '', sku: '', saldo: 0, estoque_minimo: 0 })
  const [erros, setErros] = useState({})

  const mudar = (campo) => (e) => setF({ ...f, [campo]: e.target.value })

  const salvar = (e) => {
    e.preventDefault()
    api.post('/produtos/', f).then(() => navigate('/inventario')).catch(setErros)
  }

  const campo = (nome, rotulo, tipo = 'text') => (
    <div className="field">
      <label className="field-label">{rotulo}</label>
      <input type={tipo} value={f[nome]} onChange={mudar(nome)} />
      {erros[nome] && <span className="erro">{erros[nome].join(' ')}</span>}
    </div>
  )

  return (
    <>
      <Link className="voltar" to="/inventario"><Icon name="back" size={14} /> Voltar</Link>
      <div className="page-header"><h1>Novo produto</h1></div>
      <form className="card form-card" onSubmit={salvar}>
        {campo('nome', 'Nome')}
        {campo('sku', 'SKU')}
        {campo('saldo', 'Saldo inicial', 'number')}
        {campo('estoque_minimo', 'Estoque mínimo', 'number')}
        <div className="rodape-form">
          <Link className="btn" to="/inventario">Cancelar</Link>
          <button className="btn primario" type="submit">Salvar</button>
        </div>
      </form>
    </>
  )
}
