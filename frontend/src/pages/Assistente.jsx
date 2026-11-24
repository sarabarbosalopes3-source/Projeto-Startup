import React, { useState } from 'react'
import { api } from '../api.js'

const SUGESTOES = [
  'Quantos produtos temos cadastrados?',
  'Quais produtos precisam de reposição?',
  'Como está a situação geral do estoque?',
  'Quais foram as últimas movimentações?',
]

export default function Assistente() {
  const [pergunta, setPergunta] = useState('')
  const [mensagens, setMensagens] = useState([
    {
      tipo: 'ia',
      texto: 'Olá! Sou o assistente inteligente do Logis. Posso ajudar você a consultar produtos, analisar o estoque e entender as movimentações. O que deseja saber?',
    },
  ])
  const [carregando, setCarregando] = useState(false)

  async function enviar(e) {
    e.preventDefault()

    const texto = pergunta.trim()

    if (!texto || carregando) return

    setMensagens((anteriores) => [
      ...anteriores,
      { tipo: 'usuario', texto },
    ])

    setPergunta('')
    setCarregando(true)

    try {
      const dados = await api.post('/assistente/', {
        pergunta: texto,
      })

      setMensagens((anteriores) => [
        ...anteriores,
        {
          tipo: 'ia',
          texto: dados.resposta,
        },
      ])
    } catch (erro) {
      setMensagens((anteriores) => [
        ...anteriores,
        {
          tipo: 'erro',
          texto: erro.erro || 'Não foi possível obter uma resposta. Tente novamente.',
        },
      ])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Assistente IA</h1>
          <p className="muted">
            Consulte informações e analise seu estoque usando inteligência artificial.
          </p>
        </div>
        <span className="assistente-status">
          <i /> Gemini conectado
        </span>
      </div>

      <div className="assistente-card">
        <div className="assistente-topo">
          <div className="assistente-avatar">IA</div>
          <div>
            <strong>Assistente Logis</strong>
            <p className="muted pequeno">Especialista em gerenciamento de estoque</p>
          </div>
        </div>

        <div className="assistente-mensagens">
          {mensagens.map((mensagem, indice) => (
            <div
              key={indice}
              className={`mensagem ${mensagem.tipo}`}
            >
              <div className="mensagem-autor">
                {mensagem.tipo === 'usuario' ? 'Você' : 'Assistente Logis'}
              </div>
              <div className="mensagem-texto">{mensagem.texto}</div>
            </div>
          ))}

          {carregando && (
            <div className="mensagem ia">
              <div className="mensagem-autor">Assistente Logis</div>
              <div className="mensagem-texto">Analisando os dados do estoque...</div>
            </div>
          )}
        </div>

        <div className="assistente-sugestoes">
          <span className="muted pequeno">Experimente perguntar:</span>

          <div className="sugestoes-ia">
            {SUGESTOES.map((sugestao) => (
              <button
                key={sugestao}
                type="button"
                className="btn mini"
                disabled={carregando}
                onClick={() => setPergunta(sugestao)}
              >
                {sugestao}
              </button>
            ))}
          </div>
        </div>

        <form className="assistente-form" onSubmit={enviar}>
          <textarea
            rows="2"
            placeholder="Digite sua pergunta sobre o estoque..."
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            disabled={carregando}
          />

          <button
            type="submit"
            className="btn primario"
            disabled={carregando || !pergunta.trim()}
          >
            {carregando ? 'Enviando...' : 'Enviar pergunta'}
          </button>
        </form>

        <p className="assistente-aviso">
          As respostas são geradas por IA com base nos dados disponíveis no sistema.
        </p>
      </div>
    </>
  )
}
