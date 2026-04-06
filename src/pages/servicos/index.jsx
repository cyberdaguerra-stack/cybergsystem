import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Wrench, Loader } from 'lucide-react'
import { Card, Button, Badge, Modal, Input, Select } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { fKz } from '@/lib/utils'
import { api } from '@/lib/api'

const CAT_BADGE = { Internet:'blue', Instalação:'cyan', Suporte:'green', TV:'orange', Outros:'gray' }
const EMPTY_FORM = { nome:'', preco_mensal:'', categoria_id:'', descricao:'', status:'activo' }

export default function Servicos() {
  const { can } = useAuth()
  const toast = useToast()
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]         = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesData, categoriesData] = await Promise.all([
        api.get('/servicos'),
        api.get('/categorias-servico'),
      ])
      
      setServices(Array.isArray(servicesData) ? servicesData : servicesData.data || [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [])
    } catch (err) {
      console.error('Erro ao carregar serviços:', err)
      toast('Erro ao carregar serviços', 'error')
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!form.nome.trim() || !form.preco_mensal) { toast('Preencha nome e preço', 'error'); return }
    try {
      await api.post('/servicos', {
        nome: form.nome.trim(),
        preco_mensal: Number(form.preco_mensal),
        categoria_id: form.categoria_id || null,
        descricao: form.descricao.trim(),
        status: form.status,
      })
      setForm(EMPTY_FORM); setOpen(false)
      toast('Serviço criado com sucesso', 'success')
      await fetchData()
    } catch (err) {
      console.error('Erro ao criar serviço:', err)
      toast('Erro ao criar serviço', 'error')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover?')) return
    try {
      await api.delete(`/servicos/${id}`)
      toast('Serviço removido', 'info')
      await fetchData()
    } catch (err) {
      console.error('Erro ao remover serviço:', err)
      toast('Erro ao remover serviço', 'error')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Loader size={32} style={{ animation: 'spin 2s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:'var(--f-display)', fontSize:22, fontWeight:800, letterSpacing:'-.02em' }}>Serviços</h2>
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:3 }}>Catálogo de serviços da empresa</p>
        </div>
        {can('canManageServices') && (
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus size={14} strokeWidth={2.5} /> Novo Serviço
          </Button>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
        {services.length > 0 ? (
          services.map(s => (
            <Card key={s.id} style={{ display:'flex', flexDirection:'column', gap:14, transition:'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:'var(--glass-bg)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Wrench size={16} color="var(--text-secondary)" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--f-display)', fontSize:14, fontWeight:700, lineHeight:1.2 }}>{s.nome}</div>
                    <Badge variant={s.categoria ? 'blue' : 'gray'} style={{ marginTop:5 }}>{s.categoria || 'Sem categoria'}</Badge>
                  </div>
                </div>
                <Badge variant={s.status==='activo'?'green':'orange'}>{s.status==='activo'?'Activo':'Inactivo'}</Badge>
              </div>

              <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, flex:1 }}>{s.descricao || 'Sem descrição'}</p>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--glass-border)' }}>
                <div>
                  <span style={{ fontFamily:'var(--f-display)', fontSize:20, fontWeight:800 }}>{fKz(s.preco)}</span>
                  <span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:4 }}>/mês</span>
                </div>
                {can('canManageServices') && (
                  <div style={{ display:'flex', gap:6 }}>
                    <button style={{ width:28, height:28, borderRadius:7, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(96,165,250,.1)'; e.currentTarget.style.color='var(--c-info)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-muted)' }}
                    >
                      <Pencil size={14} strokeWidth={1.8} />
                    </button>
                    <button onClick={() => remove(s.id)} style={{ width:28, height:28, borderRadius:7, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(251,113,133,.1)'; e.currentTarget.style.color='var(--c-danger)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-muted)' }}
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 20px' }}>
            Nenhum serviço cadastrado
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => { setOpen(false); setForm(EMPTY_FORM) }} title="Novo Serviço">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Input label="Nome do Serviço *" placeholder="Ex: Internet Fibra 50 Mbps" value={form.nome} onChange={e => set('nome', e.target.value)} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <Input label="Preço Mensal (Kz) *" type="number" min="0" value={form.preco_mensal} onChange={e => set('preco_mensal', e.target.value)} />
            <Select label="Categoria" value={form.categoria_id} onChange={e => set('categoria_id', e.target.value)}>
              <option value="">Sem categoria</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
          </div>
          <Input label="Descrição" placeholder="Breve descrição do serviço" value={form.descricao} onChange={e => set('descricao', e.target.value)} />
          <Select label="Estado" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Select>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:4 }}>
            <Button variant="ghost" onClick={() => { setOpen(false); setForm(EMPTY_FORM) }}>Cancelar</Button>
            <Button variant="primary" onClick={save}>Criar Serviço</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
