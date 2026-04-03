import { useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { Button, Badge, Modal, Input, Select, Table, Thead, Th, Td, Tr } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { fDate } from '@/lib/utils'

const ROLE_BADGE  = { admin_geral:'purple', admin:'blue', funcionario:'green' }
const ROLE_LABELS = { admin_geral:'Admin Geral', admin:'Admin', funcionario:'Funcionário' }
const ROLE_GRAD   = {
  admin_geral: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
  admin:       'linear-gradient(135deg,#3b82f6,#06b6d4)',
  funcionario: 'linear-gradient(135deg,#10b981,#06b6d4)',
}

const INIT = [
  { id:1, nome:'Carlos Mendes',       email:'carlos@cyberg.ao',  role:'admin_geral', status:'activo',   ultimo: new Date() },
  { id:2, nome:'João Administrador',  email:'joao@cyberg.ao',    role:'admin',       status:'activo',   ultimo: new Date(Date.now()-86400000) },
  { id:3, nome:'Maria Funcionária',   email:'maria@cyberg.ao',   role:'funcionario', status:'activo',   ultimo: new Date(Date.now()-86400000*2) },
  { id:4, nome:'Paulo Técnico',       email:'paulo@netfacil.ao', role:'funcionario', status:'inactivo', ultimo: new Date(Date.now()-86400000*6) },
]

const EMPTY = { nome:'', email:'', role:'funcionario', senha:'' }

export default function Usuarios() {
  const toast = useToast()
  const [users, setUsers] = useState(INIT)
  const [open, setOpen]   = useState(false)
  const [form, setForm]   = useState(EMPTY)
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }))

  const save = () => {
    if (!form.nome.trim() || !form.email.trim()) { toast('Preencha nome e email', 'error'); return }
    if (form.senha && form.senha.length < 8) { toast('Senha deve ter pelo menos 8 caracteres', 'error'); return }
    setUsers(u => [...u, { id:Date.now(), ...form, status:'activo', ultimo:new Date() }])
    setForm(EMPTY); setOpen(false)
    toast('Utilizador criado com sucesso', 'success')
  }

  const remove = (id) => {
    setUsers(u => u.filter(x => x.id !== id))
    toast('Utilizador removido', 'info')
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:'var(--f-display)', fontSize:22, fontWeight:800, letterSpacing:'-.02em' }}>Utilizadores</h2>
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:3 }}>Gestão de contas e permissões</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={14} strokeWidth={2.5} /> Novo Utilizador
        </Button>
      </div>

      <div className="glass" style={{ overflow:'hidden', padding:0 }}>
        <Table>
          <Thead>
            <tr><Th>Utilizador</Th><Th>Email</Th><Th>Perfil</Th><Th>Estado</Th><Th>Último Acesso</Th><Th></Th></tr>
          </Thead>
          <tbody>
            {users.map(u => (
              <Tr key={u.id}>
                <Td>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:ROLE_GRAD[u.role], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, flexShrink:0 }}>
                      {u.nome.charAt(0)}
                    </div>
                    <span style={{ fontWeight:500, fontSize:13.5 }}>{u.nome}</span>
                  </div>
                </Td>
                <Td style={{ fontSize:12.5, color:'var(--text-secondary)' }}>{u.email}</Td>
                <Td><Badge variant={ROLE_BADGE[u.role]}>{ROLE_LABELS[u.role]}</Badge></Td>
                <Td><Badge variant={u.status==='activo'?'green':'orange'}>{u.status==='activo'?'Activo':'Inactivo'}</Badge></Td>
                <Td style={{ fontSize:12, color:'var(--text-secondary)' }}>{fDate(u.ultimo)}</Td>
                <Td>
                  <div style={{ display:'flex', gap:6 }}>
                    <button style={{ width:28, height:28, borderRadius:7, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(96,165,250,.1)'; e.currentTarget.style.color='var(--c-info)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-muted)' }}
                    ><Pencil size={14} strokeWidth={1.8} /></button>
                    <button onClick={() => remove(u.id)} style={{ width:28, height:28, borderRadius:7, background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(251,113,133,.1)'; e.currentTarget.style.color='var(--c-danger)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-muted)' }}
                    ><Trash2 size={14} strokeWidth={1.8} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal open={open} onClose={() => { setOpen(false); setForm(EMPTY) }} title="Novo Utilizador">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <Input label="Nome Completo *" value={form.nome} onChange={e => set('nome', e.target.value)} />
            <Select label="Perfil" value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="funcionario">Funcionário</option>
              <option value="admin">Admin</option>
              <option value="admin_geral">Admin Geral</option>
            </Select>
          </div>
          <Input label="Email *" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          <Input label="Senha Temporária" type="password" placeholder="Mínimo 8 caracteres" value={form.senha} onChange={e => set('senha', e.target.value)} />
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:4 }}>
            <Button variant="ghost" onClick={() => { setOpen(false); setForm(EMPTY) }}>Cancelar</Button>
            <Button variant="primary" onClick={save}>Criar Conta</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
