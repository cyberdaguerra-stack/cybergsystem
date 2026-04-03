import { clsx } from 'clsx'

export const cn = (...a) => clsx(a)

export const fKz = (v) =>
  new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 0 }).format(v ?? 0) + ' Kz'

export const fDate = (d, opts = {}) =>
  d ? new Date(d).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric', ...opts }) : '—'

export const fTime = (d) =>
  d ? new Date(d).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }) : '—'

export const pct = (part, total) =>
  total ? Math.round((part / total) * 100) : 0
