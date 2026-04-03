import { TrendingUp, TrendingDown, DollarSign, Layers, RefreshCw } from 'lucide-react'
import { StatCard, Card, ProgressBar, Button, Badge, Table, Thead, Th, Td, Tr } from '@/components/ui'
import { AreaChartWidget } from '@/components/charts/AreaChart.jsx'
import { fKz, fDate } from '@/lib/utils'

const MONTH_DATA = [
  { mes: 'Out', receita: 420000, despesa: 168000 },
  { mes: 'Nov', receita: 380000, despesa: 152000 },
  { mes: 'Dez', receita: 510000, despesa: 204000 },
  { mes: 'Jan', receita: 460000, despesa: 184000 },
  { mes: 'Fev', receita: 530000, despesa: 212000 },
  { mes: 'Mar', receita: 580000, despesa: 212500 },
]

const RECENT = [
  { id: 1, tipo: 'entrada', descricao: 'Mensalidade Fibra — A. Santos',   categoria: 'Internet',   valor: 45000, data: new Date() },
  { id: 2, tipo: 'saida',   descricao: 'Fornecedor Fibra Óptica',          categoria: 'Fornecedor', valor: 85000, data: new Date(Date.now() - 86400000) },
  { id: 3, tipo: 'entrada', descricao: 'Instalação — Bairro Rangel',       categoria: 'Instalação', valor: 35000, data: new Date(Date.now() - 86400000 * 2) },
  { id: 4, tipo: 'saida',   descricao: 'Folha Salarial — Março',           categoria: 'Salários',   valor: 120000, data: new Date(Date.now() - 86400000 * 4) },
  { id: 5, tipo: 'entrada', descricao: 'Suporte Técnico Remoto',           categoria: 'Suporte',    valor: 9500,  data: new Date(Date.now() - 86400000 * 5) },
]

const DESPESAS_CAT = [
  { label: 'Salários',     pct: 45, color: '#7c3aed' },
  { label: 'Fornecedores', pct: 28, color: '#3b82f6' },
  { label: 'Operacional',  pct: 18, color: '#06b6d4' },
  { label: 'Outros',       pct: 9,  color: '#8b5cf6' },
]

export default function Dashboard() {
  const today = new Date().toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Visão Geral</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3, textTransform: 'capitalize' }}>{today}</p>
        </div>
        <Button variant="ghost" size="sm" style={{ gap: 6 }}>
          <RefreshCw size={13} strokeWidth={2} />
          Actualizar
        </Button>
      </div>

      {/* KPI row — 4 cards like the image */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        <StatCard
          label="Receita do Mês"
          value={fKz(580000)}
          change="12%"
          changeUp
          icon={TrendingUp}
          gradient="var(--grad-card-1)"
        />
        <StatCard
          label="Despesas do Mês"
          value={fKz(212500)}
          change="5%"
          changeUp={false}
          icon={TrendingDown}
          gradient="var(--grad-card-2)"
        />
        <StatCard
          label="Lucro Líquido"
          value={fKz(367500)}
          change="18%"
          changeUp
          icon={DollarSign}
          gradient="var(--grad-card-3)"
        />
        <StatCard
          label="Serviços Activos"
          value="24"
          change="+3"
          changeUp
          icon={Layers}
          gradient="var(--grad-card-4)"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14 }}>

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
          <AreaChartWidget
            data={MONTH_DATA}
            series={[
              { key: 'receita', label: 'Receita',  color: '#7c3aed' },
              { key: 'despesa', label: 'Despesas', color: '#fb7185' },
            ]}
            height={210}
          />
        </Card>

        {/* Despesas breakdown */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Despesas por Categoria</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {DESPESAS_CAT.map(d => (
              <ProgressBar key={d.label} label={d.label} value={d.pct} color={d.color} showPct />
            ))}
          </div>

          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Total Despesas (mês)</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 800 }}>{fKz(212500)}</div>
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
            {RECENT.map(tx => (
              <Tr key={tx.id}>
                <Td><Badge variant={tx.tipo === 'entrada' ? 'green' : 'red'}>{tx.tipo === 'entrada' ? 'Entrada' : 'Saída'}</Badge></Td>
                <Td style={{ fontWeight: 500 }}>{tx.descricao}</Td>
                <Td><Badge variant="gray">{tx.categoria}</Badge></Td>
                <Td style={{ fontWeight: 600, color: tx.tipo === 'entrada' ? 'var(--c-success)' : 'var(--c-danger)' }}>
                  {tx.tipo === 'entrada' ? '+' : '-'}{fKz(tx.valor)}
                </Td>
                <Td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fDate(tx.data)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

    </div>
  )
}
