import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, Loader } from 'lucide-react'
import { Button, Badge, Modal, Input, Select, Table, Thead, Th, Td, Tr } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { api } from '@/lib/api'
import { fDate } from '@/lib/utils'

const ROLE_BADGE  = { admin_geral:'purple', admin:'blue', funcionario:'green' }
const ROLE_LABELS = { admin_geral:'Admin Geral', admin:'Administrador', funcionario:'Funcionário' }
const ROLE_GRAD   = {
  admin_geral: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
  admin:       'linear-gradient(135deg,#3b82f6,#06b6d4)',
  funcionario: 'linear-gradient(135deg,#10b981,#06b6d4)',
}

const EMPTY = { id: null, nome: '', email: '', role: 'funcionario', password: '' }

export default function Usuarios() {
  const { user: currentUser, can } = useAuth()
  const toast = useToast()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [mode, setMode] = useState('create')
  const [form, setForm] = useState(EMPTY)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await api.get('/usuarios')
      setUsers(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      toast(err.message || 'Erro ao carregar utilizadores', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setMode('create')
    setForm(EMPTY)
    setOpenModal(true)
  }

  const handleEdit = (u) => {
    setMode('edit')
    setForm({ id: u.id, nome: u.nome, email: u.email, role: u.role, password: '' })
    setOpenModal(true)
  }

  const handleSave = async () => {
    if (!form.nome.trim() || !form.email.trim()) {
      toast('Preencha nome e email', 'error')
      return
    }

    if (mode === 'create' && !form.password) {
      toast('Senha é obrigatória ao criar', 'error')
      return
    }

    if (form.password && form.password.length < 8) {
      toast('Senha deve ter pelo menos 8 caracteres', 'error')
      return
    }

    if (form.role === 'admin_geral' && currentUser.role !== 'admin_geral') {
      toast('Apenas Admin Geral pode criar/editar Admin Geral', 'error')
      return
    }

    setSubmitting(true)
    try {
      const payload = { nome: form.nome, email: form.email, role: form.role }
      if (form.password) payload.password = form.password

      if (mode === 'create') {
        await api.post('/usuarios', payload)
        toast('Utilizador criado com sucesso', 'success')
      } else {
        await api.put(`/usuarios/${form.id}`, payload)
        toast('Utilizador atualizado com sucesso', 'success')
      }

      setOpenModal(false)
      setForm(EMPTY)
      await fetchUsers()
    } catch (err) {
      toast(err.message || 'Erro ao salvar utilizador', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setSubmitting(true)
    try {
      await api.delete(`/usuarios/${id}`)
      toast('Utilizador deletado com sucesso', 'success')
      setDeleteConfirm(null)
      await fetchUsers()
    } catch (err) {
      toast(err.message || 'Erro ao deletar utilizador', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const hasAdminAccess = can('canManageUsers')


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>
            Utilizadores
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
            Gestão de contas e permissões
          </p>
        </div>
        {hasAdminAccess && (
          <Button variant="primary" onClick={handleCreate} disabled={loading}>
            <Plus size={14} strokeWidth={2.5} /> Novo Utilizador
          </Button>
        )}
      </div>

      <div className="glass" style={{ overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Loader size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Carregando utilizadores...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Nenhum utilizador encontrado</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <Table>
              <Thead>
                <tr>
                  <Th>Utilizador</Th>
                  <Th>Email</Th>
                  <Th>Perfil</Th>
                  <Th>Estado</Th>
                  <Th>Último Acesso</Th>
                  {hasAdminAccess && <Th></Th>}
                </tr>
              </Thead>
              <tbody>
              {users.map(u => (
                <Tr key={u.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: ROLE_GRAD[u.role],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {u.nome.charAt(0)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500, fontSize: 13.5 }}>{u.nome}</span>
                        {u.id === currentUser.id && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>você</span>
                        )}
                      </div>
                    </div>
                  </Td>
                  <Td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{u.email}</Td>
                  <Td>
                    <Badge variant={ROLE_BADGE[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                  </Td>
                  <Td>
                    <Badge variant={u.status === 'activo' ? 'green' : 'orange'}>
                      {u.status === 'activo' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Td>
                  <Td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {u.ultimo_acesso ? fDate(new Date(u.ultimo_acesso)) : 'Nunca'}
                  </Td>
                  {hasAdminAccess && (
                    <Td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleEdit(u)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 7,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all .15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(96,165,250,.1)'
                            e.currentTarget.style.color = 'var(--c-info)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'none'
                            e.currentTarget.style.color = 'var(--text-muted)'
                          }}
                        >
                          <Pencil size={14} strokeWidth={1.8} />
                        </button>
                        {u.id !== currentUser.id && (
                          <button
                            onClick={() => setDeleteConfirm(u.id)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 7,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all .15s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(251,113,133,.1)'
                              e.currentTarget.style.color = 'var(--c-danger)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'none'
                              e.currentTarget.style.color = 'var(--text-muted)'
                            }}
                          >
                            <Trash2 size={14} strokeWidth={1.8} />
                          </button>
                        )}
                      </div>
                    </Td>
                  )}
                </Tr>
              ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {hasAdminAccess && (
        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false)
            setForm(EMPTY)
          }}
          title={mode === 'create' ? 'Novo Utilizador' : 'Editar Utilizador'}
        >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Input
              label="Nome Completo *"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="João Silva"
            />
            <Select label="Perfil" value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="funcionario">Funcionário</option>
              <option value="admin">Administrador</option>
              {currentUser.role === 'admin_geral' && <option value="admin_geral">Admin Geral</option>}
            </Select>
          </div>
          <Input
            label="Email *"
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="joao@cyberg.ao"
          />
          <Input
            label={mode === 'create' ? 'Senha *' : 'Senha (deixar em branco para manter)'}
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={e => set('password', e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <Button
              variant="ghost"
              onClick={() => {
                setOpenModal(false)
                setForm(EMPTY)
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={submitting}>
              {submitting ? 'Salvando...' : mode === 'create' ? 'Criar Conta' : 'Atualizar'}
            </Button>
          </div>
        </div>
      </Modal>
      )}

      <Modal
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar Eliminação"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Tem a certeza que deseja eliminar este utilizador? Esta ação não pode ser desfeita.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={submitting}
            >
              {submitting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}