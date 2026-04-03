import { TrendingUp, TrendingDown, DollarSign, BarChart3, Hash, Activity } from 'lucide-react'
import { StatCard, Card, ProgressBar } from '@/components/ui'
import { AreaChartWidget } from '@/components/charts/AreaChart.jsx'
import { BarChartWidget } from '@/components/charts/BarChart.jsx'
import { fKz } from '@/lib/utils'

const MONTH_DATA = [
  { mes: 'Out', receita: 420000, despesa: 168000 },
  { mes: 'Nov', receita: 380000, despesa: 152000 },
  { mes: 'Dez', receita: 510000, despesa: 204000 },
  { mes: 'Jan', receita: 460000, despesa: 184000 },
  { mes: 'Fev', receita: 530000, despesa: 212000 },
  { mes: 'Mar', receita: 580000, despesa: 212500 },
]

const CAT_DESPESAS = [
  { label: 'Salários',     pct: 45, color: '#7c3aed', valor: 95625  },
  { label: 'Fornecedores', pct: 28, color: '#3b82f6', valor: 59500  },
  { label: 'Operacional',  pct: 18, color: '#06b6d4', valor: 38250  },
  { label: 'Equipamento',  pct: 9,  color: '#f59e0b', valor: 19125  },
]

export default function Estatisticas() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <h2 style={{ fontFamily:'var(--f-display)', fontSize:22, fontWeight:800, letterSpacing:'-.02em' }}>Estatísticas</h2>
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:3 }}>Indicadores financeiros — Março 2025</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        <StatCard label="Receita Total"     value={fKz(580000)}  change="12%" changeUp icon={TrendingUp}   gradient="var(--grad-card-1)" />
        <StatCard label="Despesas Totais"   value={fKz(212500)}  change="5%"  changeUp={false} icon={TrendingDown}  gradient="var(--grad-card-2)" />
        <StatCard label="Lucro Líquido"     value={fKz(367500)}  change="18%" changeUp icon={DollarSign}  gradient="var(--grad-card-3)" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        <StatCard label="Margem de Lucro"   value="63.4%"         change="4%"  changeUp icon={Activity}    />
        <StatCard label="Transacções"       value="142"           change="+18" changeUp icon={Hash}         />
        <StatCard label="Ticket Médio"      value={fKz(4082)}    change="7%"  changeUp icon={BarChart3}    />
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Evolução de Receita</div>
          <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:18 }}>Últimos 6 meses</div>
          <AreaChartWidget
            data={MONTH_DATA}
            series={[{ key:'receita', label:'Receita', color:'#7c3aed' }]}
            height={200}
          />
        </Card>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Receita vs Despesas</div>
          <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:18 }}>Comparativo mensal</div>
          <BarChartWidget data={MONTH_DATA} dataKey="receita" height={200} />
        </Card>
      </div>

      {/* Breakdown */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Despesas por Categoria</div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {CAT_DESPESAS.map(d => (
              <ProgressBar key={d.label} label={d.label} value={d.pct} color={d.color} showPct />
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Detalhe de Despesas</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {CAT_DESPESAS.map(d => (
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
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
