async function chamar(url, opcoes) {
  const r = await fetch('/api' + url, opcoes)
  let dados = null
  try {
    dados = await r.json()
  } catch {
    // resposta não veio em JSON (página de erro do servidor)
  }
  if (!r.ok) throw dados || { erro: `Erro ${r.status} do servidor (${r.statusText || 'sem detalhes'}).` }
  return dados
}

export const api = {
  get: (url) => chamar(url),
  post: (url, corpo) =>
    chamar(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    }),
  delete: (url) => chamar(url, { method: 'DELETE' }),
}