async function chamar(url, opcoes) {
  const r = await fetch('/api' + url, opcoes)
  const dados = await r.json()
  if (!r.ok) throw dados
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