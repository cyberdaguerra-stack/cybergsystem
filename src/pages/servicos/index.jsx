import { useState } from 'react'
import { Plus, Trash2, Pencil, Wrench } from 'lucide-react'
import { Card, Button, Badge, Modal, Input, Select } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { fKz } from '@/lib/utils'

const INIT = [
  { id:1,  nome:'Internet Fibra 10 Mbps',      preco:25000,  cat:'Internet',   desc:'Plano residencial básico fibra óptica',    status:'activo'   },
  { id:2,  nome:'Internet Fibra 50 Mbps',      preco:45000,  cat:'Internet',   desc:'Plano médio — ideal para famílias',        status:'activo'   },
  { id:3,  nome:'Internet Fibra 100 Mbps',     preco:75000,  cat:'Internet',   desc:'Alta velocidade para empresas e gaming',   status:'activo'   },
  { id:4,  nome:'Instalação Residencial',      preco:35000,  cat:'Instalação', desc:'Instalação completa de fibra em casa',     status:'activo'   },
  { id:5,  nome:'Suporte Técnico Remoto',      preco:8000,   cat:'Suporte',    desc:'Assistência via vídeo ou telefone',        status:'activo'   },
  { id:6,  nome:'Suporte Técnico Presencial',  preco:15000,  cat:'Suporte',    desc:'Técnico deslocado ao local',               status:'activo'   },
  { id:7,  nome:'TV por Cabo Premium',         preco:22000,  cat:'TV',         desc:'Pacote com 120+ canais HD',                status:'inactivo' },
]

const CAT_BADGE = { Internet:'blue', Instalação:'cyan', Suporte:'green', TV:'orange', Outros:'gray' }
const EMPTY_FORM = { nome:'', preco:'', cat:'Internet', desc:'', status:'activo' }

export default function Servicos() {
  const { can } = useAuth()
  const toast = useToast()
  const [services, setServices] = useState(INIT)
  const [open, setOpen]         = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.nome.trim() || !form.preco) { toast('Preencha nome e preço', 'error'); return }
    setServices(s => [...s, { id: Date.now(), ...form, preco: Number(form.preco) }])
    setForm(EMPTY_FORM); setOpen(false)
    toast('Serviço criado com sucesso', 'success')
  }

  const remove = (id) => {
    setServices(s => s.filter(x => x.id !== id))
    toast('Serviço removido', 'info')
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

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:14 }}>
        {services.map(s => (
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
                  <Badge variant={CAT_BADGE[s.cat]||'gray'} style={{ marginTop:5 }}>{s.cat}</Badge>
                </div>
              </div>
              <Badge variant={s.status==='activo'?'green':'orange'}>{s.status==='activo'?'Activo':'Inactivo'}</Badge>
            </div>

            <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, flex:1 }}>{s.desc}</p>

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
        ))}
      </div>

      <Modal open={open} onClose={() => { setOpen(false); setForm(EMPTY_FORM) }} title="Novo Serviço">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Input label="Nome do Serviço *" placeholder="Ex: Internet Fibra 50 Mbps" value={form.nome} onChange={e => set('nome', e.target.value)} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <Input label="Preço Mensal (Kz) *" type="number" min="0" value={form.preco} onChange={e => set('preco', e.target.value)} />
            <Select label="Categoria" value={form.cat} onChange={e => set('cat', e.target.value)}>
              {['Internet','Instalação','Suporte','TV','Outros'].map(c => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <Input label="Descrição" placeholder="Breve descrição do serviço" value={form.desc} onChange={e => set('desc', e.target.value)} />
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
