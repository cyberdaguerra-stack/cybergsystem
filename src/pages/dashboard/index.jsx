import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Layers, RefreshCw, Loader } from 'lucide-react'
import { StatCard, Card, ProgressBar, Button, Badge, Table, Thead, Th, Td, Tr } from '@/components/ui'
import { AreaChartWidget } from '@/components/charts/AreaChart.jsx'
import { fKz, fDate } from '@/lib/utils'
import { api } from '@/lib/api'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [receita, setReceita] = useState(0)
  const [despesa, setDespesa] = useState(0)
  const [saldo, setSaldo] = useState(0)
  const [servicos, setServicos] = useState(0)
  const [monthData, setMonthData] = useState([])
  const [despesasCat, setDespesasCat] = useState([])
  const [recent, setRecent] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [fluxoData, servicosData] = await Promise.all([
        api.get('/fluxo'),
        api.get('/servicos'),
      ])

      const rows = Array.isArray(fluxoData) ? fluxoData : fluxoData.data || []
      const services = Array.isArray(servicosData) ? servicosData : servicosData.data || []

      // Calcular receita, despesa, saldo
      const totalReceita = rows
        .filter(r => r.tipo === 'entrada')
        .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)
      const totalDespesa = rows
        .filter(r => r.tipo === 'saida')
        .reduce((sum, r) => sum + (parseFloat(r.valor) || 0), 0)
      const totalSaldo = totalReceita - totalDespesa

      setReceita(totalReceita)
      setDespesa(totalDespesa)
      setSaldo(totalSaldo)
      setServicos(services.length)

      // Agrupar por mês para o gráfico (últimos 6 meses)
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

      // Calcular despesas por categoria
      const catMap = {}
      rows
        .filter(r => r.tipo === 'saida')
        .forEach(r => {
          const cat = r.categoria || 'Outros'
          catMap[cat] = (catMap[cat] || 0) + (parseFloat(r.valor) || 0)
        })

      const total = Object.values(catMap).reduce((a, b) => a + b, 0) || 1
      const cats = Object.entries(catMap).map(([label, value]) => ({
        label,
        pct: Math.round((value / total) * 100),
        color: ['#7c3aed', '#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899'][Object.keys(catMap).indexOf(label) % 5],
      }))

      setDespesasCat(cats)

      // Transações recentes (últimas 10)
      const recentTx = rows
        .sort((a, b) => new Date(b.data_tx) - new Date(a.data_tx))
        .slice(0, 10)

      setRecent(recentTx)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Loader size={32} style={{ animation: 'spin 2s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Visão Geral</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3, textTransform: 'capitalize' }}>{today}</p>
        </div>
        <Button variant="ghost" size="sm" style={{ gap: 6 }} onClick={fetchData}>
          <RefreshCw size={13} strokeWidth={2} />
          Actualizar
        </Button>
      </div>

      {/* KPI row — 4 cards like the image */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
        <StatCard
          label="Receita do Mês"
          value={fKz(receita)}
          change="12%"
          changeUp
          icon={TrendingUp}
          gradient="var(--grad-card-1)"
        />
        <StatCard
          label="Despesas do Mês"
          value={fKz(despesa)}
          change="5%"
          changeUp={false}
          icon={TrendingDown}
          gradient="var(--grad-card-2)"
        />
        <StatCard
          label="Lucro Líquido"
          value={fKz(saldo)}
          change={saldo >= 0 ? "18%" : "-5%"}
          changeUp={saldo >= 0}
          icon={DollarSign}
          gradient="var(--grad-card-3)"
        />
        <StatCard
          label="Serviços Activos"
          value={servicos.toString()}
          change="+2"
          changeUp
          icon={Layers}
          gradient="var(--grad-card-4)"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>

        {/* Area chart */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Rendimento Mensal</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Últimos 6 meses</div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {[{ color: '#7c3aed', label: 'Receita' }, { color: '#fb7185', label: 'Despesas' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          {monthData.length > 0 ? (
            <AreaChartWidget
              data={monthData}
              series={[
                { key: 'receita', label: 'Receita',  color: '#7c3aed' },
                { key: 'despesa', label: 'Despesas', color: '#fb7185' },
              ]}
              height={210}
            />
          ) : (
            <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Sem dados para exibir
            </div>
          )}
        </Card>

        {/* Despesas breakdown */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Despesas por Categoria</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {despesasCat.length > 0 ? (
              despesasCat.map(d => (
                <ProgressBar key={d.label} label={d.label} value={d.pct} color={d.color} showPct />
              ))
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sem despesas</div>
            )}
          </div>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Total Despesas (mês)</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 800 }}>{fKz(despesa)}</div>
          </div>
        </Card>
      </div>

      {/* Recent transactions table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Transacções Recentes</div>
          <Button variant="subtle" size="sm">Ver todas</Button>
        </div>
        <Table>
          <Thead>
            <tr>
              <Th>Tipo</Th>
              <Th>Descrição</Th>
              <Th>Categoria</Th>
              <Th>Valor</Th>
              <Th>Data</Th>
            </tr>
          </Thead>
          <tbody>
            {recent.length > 0 ? (
              recent.map(tx => (
                <Tr key={tx.id}>
                  <Td><Badge variant={tx.tipo === 'entrada' ? 'green' : 'red'}>{tx.tipo === 'entrada' ? 'Entrada' : 'Saída'}</Badge></Td>
                  <Td style={{ fontWeight: 500 }}>{tx.descricao}</Td>
                  <Td><Badge variant="gray">{tx.categoria || 'N/A'}</Badge></Td>
                  <Td style={{ fontWeight: 600, color: tx.tipo === 'entrada' ? 'var(--c-success)' : 'var(--c-danger)' }}>
                    {tx.tipo === 'entrada' ? '+' : '-'}{fKz(tx.valor)}
                  </Td>
                  <Td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fDate(new Date(tx.data_tx))}</Td>
                </Tr>
              ))
            ) : (
              <Tr><Td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Sem transacções recentes</Td></Tr>
            )}
          </tbody>
        </Table>
      </Card>

    </div>
  )
}
