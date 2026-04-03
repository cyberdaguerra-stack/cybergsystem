import { Download, FileText } from 'lucide-react'
import { Card, Button, Badge, Table, Thead, Th, Td, Tr } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { fKz } from '@/lib/utils'

const HISTORY = [
  { id:1, tipo:'Mensal',  periodo:'Fevereiro 2025',  autor:'Carlos Mendes', data:'01 Mar 2025', entradas:530000, saidas:212000 },
  { id:2, tipo:'Semanal', periodo:'10–17 Mar 2025',  autor:'João Admin',    data:'18 Mar 2025', entradas:165000, saidas:52000  },
  { id:3, tipo:'Mensal',  periodo:'Janeiro 2025',    autor:'Carlos Mendes', data:'02 Fev 2025', entradas:460000, saidas:184000 },
  { id:4, tipo:'Semanal', periodo:'03–10 Mar 2025',  autor:'João Admin',    data:'11 Mar 2025', entradas:148000, saidas:45000  },
]

function ReportCard({ tipo, periodo, entradas, saidas, onPDF, onExcel }) {
  const lucro = entradas - saidas
  return (
    <Card style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:'var(--glass-bg)', border:'1px solid var(--glass-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <FileText size={18} color="var(--text-secondary)" strokeWidth={1.8} />
        </div>
        <div>
          <Badge variant={tipo==='Mensal'?'blue':'cyan'} style={{ marginBottom:5 }}>{tipo}</Badge>
          <div style={{ fontFamily:'var(--f-display)', fontSize:16, fontWeight:700 }}>Relatório {tipo}</div>
          <div style={{ fontSize:12.5, color:'var(--text-secondary)', marginTop:2 }}>{periodo}</div>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {[
          { label:'Entradas',   value:fKz(entradas), color:'var(--c-success)' },
          { label:'Saídas',     value:fKz(saidas),   color:'var(--c-danger)'  },
          { label:'Lucro',      value:fKz(lucro),    color:'var(--text-primary)', bold:true },
        ].map(row => (
          <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'var(--glass-bg)', borderRadius:9, border:'1px solid var(--glass-border)' }}>
            <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{row.label}</span>
            <span style={{ fontSize:row.bold?15:13.5, fontWeight:row.bold?800:600, color:row.color }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:8 }}>
        <Button variant="primary" style={{ flex:1, justifyContent:'center' }} onClick={onPDF}>
          <Download size={13} strokeWidth={2} /> PDF
        </Button>
        <Button variant="ghost" onClick={onExcel}>Excel</Button>
      </div>
    </Card>
  )
}

export default function Relatorios() {
  const toast = useToast()
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <h2 style={{ fontFamily:'var(--f-display)', fontSize:22, fontWeight:800, letterSpacing:'-.02em' }}>Relatórios</h2>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:3 }}>Geração e exportação de relatórios financeiros</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <ReportCard tipo="Semanal" periodo="17 Mar — 24 Mar 2025" entradas={245000} saidas={78500}  onPDF={() => toast('Relatório semanal PDF gerado', 'success')} onExcel={() => toast('Exportado para Excel', 'success')} />
        <ReportCard tipo="Mensal"  periodo="Março 2025"            entradas={580000} saidas={212500} onPDF={() => toast('Relatório mensal PDF gerado', 'success')}  onExcel={() => toast('Exportado para Excel', 'success')} />
      </div>

      <div className="glass" style={{ overflow:'hidden', padding:0 }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--glass-border)', fontSize:14, fontWeight:600 }}>
          Histórico de Relatórios
        </div>
        <Table>
          <Thead>
            <tr><Th>Tipo</Th><Th>Período</Th><Th>Gerado por</Th><Th>Data</Th><Th>Entradas</Th><Th>Saídas</Th><Th></Th></tr>
          </Thead>
          <tbody>
            {HISTORY.map(r => (
              <Tr key={r.id}>
                <Td><Badge variant={r.tipo==='Mensal'?'blue':'cyan'}>{r.tipo}</Badge></Td>
                <Td style={{ fontWeight:500 }}>{r.periodo}</Td>
                <Td style={{ fontSize:12.5, color:'var(--text-secondary)' }}>{r.autor}</Td>
                <Td style={{ fontSize:12, color:'var(--text-secondary)' }}>{r.data}</Td>
                <Td style={{ fontWeight:600, color:'var(--c-success)' }}>+{fKz(r.entradas)}</Td>
                <Td style={{ fontWeight:600, color:'var(--c-danger)' }}>−{fKz(r.saidas)}</Td>
                <Td>
                  <Button variant="ghost" size="sm" onClick={() => toast('A baixar relatório...', 'info')}>
                    <Download size={13} strokeWidth={2} /> Baixar
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
