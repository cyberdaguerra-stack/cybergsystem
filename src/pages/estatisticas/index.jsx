import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Hash, Activity, Loader } from 'lucide-react'
import { StatCard, Card, ProgressBar } from '@/components/ui'
import { AreaChartWidget } from '@/components/charts/AreaChart.jsx'
import { BarChartWidget } from '@/components/charts/BarChart.jsx'
import { fKz } from '@/lib/utils'
import { api } from '@/lib/api'

export default function Estatisticas() {
  const [loading, setLoading] = useState(true)
  const [receita, setReceita] = useState(0)
  const [despesa, setDespesa] = useState(0)
  const [saldo, setSaldo] = useState(0)
  const [margem, setMargem] = useState(0)
  const [transacoes, setTransacoes] = useState(0)
  const [ticketMedio, setTicketMedio] = useState(0)
  const [monthData, setMonthData] = useState([])
  const [despesasCat, setDespesasCat] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const fluxoData = await api.get('/fluxo')
      const rows = Array.isArray(fluxoData) ? fluxoData : fluxoData.data || []

      // Calcular totais
      const totalReceita = rows
        .filter(r => r.tipo === 'entrada')
        .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)
      const totalDespesa = rows
        .filter(r => r.tipo === 'saida')
        .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)
      const totalSaldo = totalReceita - totalDespesa
      const margemLucro = totalReceita > 0 ? ((totalSaldo / totalReceita) * 100).toFixed(1) : 0
      const ticket = rows.length > 0 ? (totalReceita / rows.length).toFixed(0) : 0

      setReceita(totalReceita)
      setDespesa(totalDespesa)
      setSaldo(totalSaldo)
      setMargem(margemLucro)
      setTransacoes(rows.length)
      setTicketMedio(ticket)

      // Agrupar por mês (últimos 6 meses)
      const monthMap = {}
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = d.toLocaleDateString('pt-AO', { month: 'short', year: '2-digit' })
        monthMap[key] = { mes: key.split(' ')[0].charAt(0).toUpperCase() + key.split(' ')[0].slice(1), receita: 0, despesa: 0 }
      }

      rows.forEach(r => {
        const date = new Date(r.data_tx)
        const key = date.toLocaleDateString('pt-AO', { month: 'short', year: '2-digit' })
        if (monthMap[key]) {
          if (r.tipo === 'entrada') monthMap[key].receita += parseFloat(r.valor) || 0
          else monthMap[key].despesa += parseFloat(r.valor) || 0
        }
      })

      setMonthData(Object.values(monthMap))

      // Despesas por categoria
      const catMap = {}
      rows
        .filter(r => r.tipo === 'saida')
        .forEach(r => {
          const cat = r.categoria || 'Outros'
          catMap[cat] = (catMap[cat] || 0) + (parseFloat(r.valor) || 0)
        })

      const total = Object.values(catMap).reduce((a, b) => a + b, 0) || 1
      const colors = ['#7c3aed', '#3b82f6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981']
      const cats = Object.entries(catMap)
        .map(([label, valor], idx) => ({
          label,
          valor,
          pct: Math.round((valor / total) * 100),
          color: colors[idx % colors.length],
        }))
        .sort((a, b) => b.valor - a.valor)

      setDespesasCat(cats)
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
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

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <h2 style={{ fontFamily:'var(--f-display)', fontSize:22, fontWeight:800, letterSpacing:'-.02em' }}>Estatísticas</h2>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:3 }}>Indicadores financeiros — {new Date().toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14 }}>
        <StatCard label="Receita Total"     value={fKz(receita)}  change="12%" changeUp icon={TrendingUp}   gradient="var(--grad-card-1)" />
        <StatCard label="Despesas Totais"   value={fKz(despesa)}  change="5%"  changeUp={false} icon={TrendingDown}  gradient="var(--grad-card-2)" />
        <StatCard label="Lucro Líquido"     value={fKz(saldo)}  change={saldo >= 0 ? "18%" : "-5%"} changeUp={saldo >= 0} icon={DollarSign}  gradient="var(--grad-card-3)" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14 }}>
        <StatCard label="Margem de Lucro"   value={`${margem}%`}        change="4%"  changeUp icon={Activity}    />
        <StatCard label="Transacções"       value={transacoes.toString()}           change="+18" changeUp icon={Hash}         />
        <StatCard label="Ticket Médio"      value={fKz(ticketMedio)}    change="7%"  changeUp icon={BarChart3}    />
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:14 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Evolução de Receita</div>
          <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:18 }}>Últimos 6 meses</div>
          {monthData.length > 0 ? (
            <AreaChartWidget
              data={monthData}
              series={[{ key:'receita', label:'Receita', color:'#7c3aed' }]}
              height={200}
            />
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Sem dados
            </div>
          )}
        </Card>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Receita vs Despesas</div>
          <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:18 }}>Comparativo mensal</div>
          {monthData.length > 0 ? (
            <BarChartWidget data={monthData} dataKey="receita" height={200} />
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Sem dados
            </div>
          )}
        </Card>
      </div>

      {/* Breakdown */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:14 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Despesas por Categoria</div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {despesasCat.length > 0 ? (
              despesasCat.map(d => (
                <ProgressBar key={d.label} label={d.label} value={d.pct} color={d.color} showPct />
              ))
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sem despesas</div>
            )}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Detalhe de Despesas</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {despesasCat.length > 0 ? (
              despesasCat.map(d => (
                <div key={d.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'var(--glass-bg)', borderRadius:10, border:'1px solid var(--glass-border)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:d.color, flexShrink:0 }} />
                    <span style={{ fontSize:13.5 }}>{d.label}</span>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:14, fontWeight:700 }}>{fKz(d.valor)}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{d.pct}%</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sem despesas</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
