import { Sun, Moon, Save } from 'lucide-react'
import { Card, Button, Input, Badge } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { ROLES } from '@/contexts/AuthContext'

export default function Configuracoes() {
  const { theme, toggle } = useTheme()
  const { user } = useAuth()
  const toast = useToast()

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <h2 style={{ fontFamily:'var(--f-display)', fontSize:22, fontWeight:800, letterSpacing:'-.02em' }}>Configurações</h2>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:3 }}>Preferências do sistema e perfil</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {/* Company profile */}
        <Card style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ fontFamily:'var(--f-display)', fontSize:15, fontWeight:700 }}>Perfil da Empresa</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <Input label="Nome da Empresa" defaultValue="Cyber G × Netfacil" />
            <Input label="Moeda" defaultValue="Kwanza (Kz)" />
            <Input label="País / Região" defaultValue="Angola" />
            <Input label="NIF" placeholder="000000000" />
          </div>
          <Button variant="primary" onClick={() => toast('Configurações guardadas com sucesso', 'success')}>
            <Save size={14} strokeWidth={2} /> Guardar Alterações
          </Button>
        </Card>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Appearance */}
          <Card style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ fontFamily:'var(--f-display)', fontSize:15, fontWeight:700 }}>Aparência</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'var(--glass-bg)', borderRadius:10, border:'1px solid var(--glass-border)' }}>
              <div>
                <div style={{ fontSize:13.5, fontWeight:500 }}>Tema da Interface</div>
                <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>Modo {theme === 'dark' ? 'escuro' : 'claro'} activo</div>
              </div>
              <button onClick={toggle} style={{
                display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:9,
                background:'var(--glass-bg)', border:'1px solid var(--glass-border)',
                cursor:'pointer', color:'var(--text-primary)', fontSize:13, fontFamily:'var(--f-body)',
                transition:'all .15s',
              }}>
                {theme === 'dark' ? <Sun size={14} strokeWidth={1.8} /> : <Moon size={14} strokeWidth={1.8} />}
                {theme === 'dark' ? 'Claro' : 'Escuro'}
              </button>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'var(--glass-bg)', borderRadius:10, border:'1px solid var(--glass-border)' }}>
              <div>
                <div style={{ fontSize:13.5, fontWeight:500 }}>Idioma</div>
                <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>Português (Angola)</div>
              </div>
              <Badge variant="blue">PT-AO</Badge>
            </div>
          </Card>

          {/* Current session */}
          <Card style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontFamily:'var(--f-display)', fontSize:15, fontWeight:700 }}>Sessão Actual</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { label:'Utilizador', value: user?.nome },
                { label:'Email',      value: user?.email },
                { label:'Perfil',     value: ROLES[user?.role]?.label },
              ].map(row => (
                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 14px', background:'var(--glass-bg)', borderRadius:9, border:'1px solid var(--glass-border)' }}>
                  <span style={{ fontSize:12.5, color:'var(--text-secondary)' }}>{row.label}</span>
                  <span style={{ fontSize:13, fontWeight:500 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
