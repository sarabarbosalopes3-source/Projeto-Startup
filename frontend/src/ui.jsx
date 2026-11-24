import React from 'react'

const ICONS = {
  logo: 'M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 0v10m0 0 9-5M12 12 3 7',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  box: 'M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8',
  swap: 'M4 8h15m0 0-4-4m4 4-4 4M20 16H5m0 0 4-4m-4 4 4 4',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  back: 'M19 12H5m0 0 6-6m-6 6 6 6',
}

export function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

export const Badge = ({ tipo }) => {
  const mapa = {
    entrada: ['verde', 'Entrada'],
    saida: ['laranja', 'Saída'],
    em_estoque: ['verde', 'Em estoque'],
    baixo: ['laranja', 'Estoque baixo'],
    sem_estoque: ['vermelho', 'Sem estoque'],
  }
  const [cor, texto] = mapa[tipo]
  return <span className={`badge ${cor}`}>{texto}</span>
}

export const dataCurta = (iso) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
