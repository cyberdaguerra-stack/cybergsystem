import { useEffect, useState } from 'react'
import { Download, FileText, Loader } from 'lucide-react'
import { Card, Button, Badge, Table, Thead, Th, Td, Tr } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { fKz } from '@/lib/utils'
import { api } from '@/lib/api'

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
  const [loading, setLoading] = useState(true)
  const [currentData, setCurrentData] = useState({ entradas: 0, saidas: 0 })
  const [previousData, setPreviousData] = useState({ entradas: 0, saidas: 0 })
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const fluxoData = await api.get('/fluxo')
      const rows = Array.isArray(fluxoData) ? fluxoData : fluxoData.data || []

      // Dados do mês atual
      const now = new Date()
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const currentTransactions = rows.filter(r => new Date(r.data_tx) >= currentMonth)

      const currentEntradas = currentTransactions
        .filter(r => r.tipo === 'entrada')
        .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)
      const currentSaidas = currentTransactions
        .filter(r => r.tipo === 'saida')
        .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)

      setCurrentData({ entradas: currentEntradas, saidas: currentSaidas })

      // Dados do mês anterior
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      const previousTransactions = rows.filter(
        r => new Date(r.data_tx) >= previousMonth && new Date(r.data_tx) <= previousMonthEnd
      )

      const previousEntradas = previousTransactions
        .filter(r => r.tipo === 'entrada')
        .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)
      const previousSaidas = previousTransactions
        .filter(r => r.tipo === 'saida')
        .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)

      setPreviousData({ entradas: previousEntradas, saidas: previousSaidas })

      // Gerar histórico (últimos 4 períodos)
      const historyList = []
      for (let i = 0; i < 4; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0)
        const monthTx = rows.filter(r => new Date(r.data_tx) >= monthStart && new Date(r.data_tx) <= monthEnd)

        const monthEntradas = monthTx
          .filter(r => r.tipo === 'entrada')
          .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)
        const monthSaidas = monthTx
          .filter(r => r.tipo === 'saida')
          .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)

        historyList.push({
          id: i,
          tipo: 'Mensal',
          periodo: d.toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' }),
          autor: 'Sistema',
          data: new Date().toLocaleDateString('pt-AO'),
          entradas: monthEntradas,
          saidas: monthSaidas,
        })
      }

      setHistory(historyList)
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err)
      toast('Erro ao carregar relatórios', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Loader size={32} style={{ animation: 'spin 2s linear infinite' }} />
      </div>
    )
  }

  const now = new Date()
  const currentPeriod = now.toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })
  const previousPeriod = new Date(now.getFullYear(), now.getMonth() - 1).toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <h2 style={{ fontFamily:'var(--f-display)', fontSize:22, fontWeight:800, letterSpacing:'-.02em' }}>Relatórios</h2>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:3 }}>Geração e exportação de relatórios financeiros</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:14 }}>
        <ReportCard tipo="Mensal" periodo={previousPeriod} entradas={previousData.entradas} saidas={previousData.saidas}  onPDF={() => toast('Relatório do mês anterior em PDF (em desenvolvimento)', 'success')} onExcel={() => toast('Exportação para Excel (em desenvolvimento)', 'success')} />
        <ReportCard tipo="Mensal"  periodo={currentPeriod}            entradas={currentData.entradas} saidas={currentData.saidas} onPDF={() => toast('Relatório do mês atual em PDF (em desenvolvimento)', 'success')}  onExcel={() => toast('Exportação para Excel (em desenvolvimento)', 'success')} />
      </div>

      <div className="glass" style={{ overflow:'hidden', padding:0 }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--glass-border)', fontSize:14, fontWeight:600 }}>
          Histórico de Relatórios
        </div>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Table>
            <Thead>
              <tr><Th>Tipo</Th><Th>Período</Th><Th>Gerado por</Th><Th>Data</Th><Th>Entradas</Th><Th>Saídas</Th><Th></Th></tr>
            </Thead>
            <tbody>
              {history.length > 0 ? (
                history.map(r => (
                  <Tr key={r.id}>
                    <Td><Badge variant={r.tipo==='Mensal'?'blue':'cyan'}>{r.tipo}</Badge></Td>
                    <Td style={{ fontWeight:500 }}>{r.periodo}</Td>
                    <Td style={{ fontSize:12.5, color:'var(--text-secondary)' }}>{r.autor}</Td>
                    <Td style={{ fontSize:12, color:'var(--text-secondary)' }}>{r.data}</Td>
                    <Td style={{ fontWeight:600, color:'var(--c-success)' }}>+{fKz(r.entradas)}</Td>
                    <Td style={{ fontWeight:600, color:'var(--c-danger)' }}>−{fKz(r.saidas)}</Td>
                    <Td>
                      <Button variant="ghost" size="sm" onClick={() => toast('Recurso em desenvolvimento...', 'info')}>
                        <Download size={13} strokeWidth={2} /> Baixar
                      </Button>
                    </Td>
                  </Tr>
                ))
            ) : (
              <Tr><Td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Sem relatórios</Td></Tr>
            )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}
