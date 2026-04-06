import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Search, Loader } from 'lucide-react'
import { StatCard, Button, Badge, Modal, Input, Select, Table, Thead, Th, Td, Tr } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { api } from '@/lib/api'
import { fKz, fDate, fTime } from '@/lib/utils'

const EMPTY_FORM = { tipo: 'entrada', descricao: '', valor: '', servico_id: '', data: '', observacoes: '' }

export default function FluxoCaixa() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('todos')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [fluxoData, servicosData] = await Promise.all([
        api.get('/fluxo'),
        api.get('/servicos')
      ])
      setRows(Array.isArray(fluxoData) ? fluxoData : fluxoData.data || [])
      setServicos(Array.isArray(servicosData) ? servicosData : servicosData.data || [])
    } catch (err) {
      toast(err.message || 'Erro ao carregar dados', 'error')
    } finally {
      setLoading(false)
    }
  }

  const entradas = rows.filter(r => r.tipo === 'entrada').reduce((s, r) => s + (Number(r.valor) || 0), 0)
  const saidas = rows.filter(r => r.tipo === 'saida').reduce((s, r) => s + (Number(r.valor) || 0), 0)

  const filtered = rows.filter(r => {
    const matchSearch = r.descricao.toLowerCase().includes(search.toLowerCase()) || (r.categoria && r.categoria.toLowerCase().includes(search.toLowerCase()))
    const matchTipo = filterTipo === 'todos' || r.tipo === filterTipo
    return matchSearch && matchTipo
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.descricao.trim() || !form.valor) {
      toast('Preencha todos os campos obrigatórios', 'error')
      return
    }
    if (Number(form.valor) <= 0) {
      toast('O valor deve ser positivo', 'error')
      return
    }

    setSubmitting(true)
    try {
      const selectedServico = form.servico_id ? servicos.find(s => s.id === Number(form.servico_id)) : null
      const payload = {
        tipo: form.tipo,
        descricao: selectedServico ? selectedServico.nome : form.descricao.trim(),
        valor: selectedServico ? Number(selectedServico.preco_mensal) : Number(form.valor),
        categoria_id: selectedServico ? selectedServico.categoria_id : null,
        data_tx: form.data || new Date().toISOString().split('T')[0],
        observacoes: form.observacoes || null,
      }
      await api.post('/fluxo', payload)
      toast('Registo adicionado com sucesso', 'success')
      setForm(EMPTY_FORM)
      setOpen(false)
      await fetchData()
    } catch (err) {
      toast(err.message || 'Erro ao adicionar registo', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id) => {
    try {
      await api.delete(`/fluxo/${id}`)
      toast('Registo removido', 'success')
      await fetchData()
    } catch (err) {
      toast(err.message || 'Erro ao remover', 'error')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Fluxo de Caixa</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>Registo diário de entradas e saídas</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={14} strokeWidth={2.5} /> Novo Registo
        </Button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <StatCard label="Total Entradas" value={fKz(entradas)} icon={TrendingUp} gradient="linear-gradient(140deg,#059669,#06b6d4)" />
        <StatCard label="Total Saídas" value={fKz(saidas)} icon={TrendingDown} gradient="linear-gradient(140deg,#be123c,#f43f5e)" />
        <StatCard label="Saldo do Dia" value={fKz(entradas - saidas)} icon={DollarSign} gradient="var(--grad-card-1)" />
      </div>

      {/* Table card */}
      <div className="glass" style={{ overflow: 'hidden', padding: 0 }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid var(--glass-border)', flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, minWidth: '100%', marginBottom: '-10px' }}>
            Registos — {new Date().toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
              borderRadius: 9, padding: '7px 12px', flex: 1, minWidth: 160,
            }}>
              <Search size={13} color="var(--text-muted)" strokeWidth={2} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Pesquisar..."
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-primary)', width: '100%', fontFamily: 'var(--f-body)' }}
              />
            </div>
            {/* Filter */}
            <select
              value={filterTipo}
              onChange={e => setFilterTipo(e.target.value)}
              style={{
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                borderRadius: 9, padding: '7px 12px', fontSize: 13,
                color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--f-body)', outline: 'none',
              }}
            >
              <option value="todos">Todos</option>
              <option value="entrada">Entradas</option>
              <option value="saida">Saídas</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Table>
            <Thead>
              <tr>
                <Th>Tipo</Th><Th>Descrição</Th><Th>Valor</Th><Th>Data</Th><Th>Status</Th><Th></Th>
              </tr>
            </Thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>Nenhum registo encontrado</td></tr>
              )}
              {filtered.map(tx => (
                <Tr key={tx.id}>
                  <Td><Badge variant={tx.tipo === 'entrada' ? 'green' : 'red'}>{tx.tipo === 'entrada' ? 'Entrada' : 'Saída'}</Badge></Td>
                  <Td style={{ fontWeight: 500, maxWidth: 280 }}>{tx.descricao}</Td>
                  <Td style={{ fontWeight: 700, color: tx.tipo === 'entrada' ? 'var(--c-success)' : 'var(--c-danger)' }}>
                    {tx.tipo === 'entrada' ? '+' : '−'}{fKz(tx.valor)}
                  </Td>
                  <Td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {fDate(new Date(tx.data_tx))}
                  </Td>
                  <Td><Badge variant="gray">{tx.status || 'Concluído'}</Badge></Td>
                  <Td>
                    <button onClick={() => remove(tx.id)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: 7,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', transition: 'all .15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,113,133,.1)'; e.currentTarget.style.color = 'var(--c-danger)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </Td>
              </Tr>
            ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => { setOpen(false); setForm(EMPTY_FORM) }} title="Novo Registo de Caixa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select label="Tipo *" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </Select>
          {form.tipo === 'entrada' && (
            <Select label="Serviço" value={form.servico_id} onChange={e => set('servico_id', e.target.value)}>
              <option value="">Introduzir manualmente</option>
              {servicos.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nome} — {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(s.preco_mensal)}
                </option>
              ))}
            </Select>
          )}
          <Input label="Descrição *" placeholder="Ex: Mensalidade Internet — Cliente X" value={form.descricao} onChange={e => set('descricao', e.target.value)} />
          <Input label="Valor (Kz) *" type="number" min="1" placeholder="0" value={form.valor} onChange={e => set('valor', e.target.value)} />
          <Input label="Data" type="date" value={form.data} onChange={e => set('data', e.target.value)} />
          <Input label="Observações" placeholder="Opcional..." value={form.observacoes} onChange={e => set('observacoes', e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <Button variant="ghost" onClick={() => { setOpen(false); setForm(EMPTY_FORM) }}>Cancelar</Button>
            <Button variant="primary" onClick={save} disabled={submitting}>{submitting ? 'Registando...' : 'Registar'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
