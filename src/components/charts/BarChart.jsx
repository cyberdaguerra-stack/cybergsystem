import {
  BarChart as ReBar, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(15,18,40,.92)', border: '1px solid rgba(255,255,255,.12)',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'rgba(255,255,255,.5)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.fill }} />
          <span style={{ color: 'rgba(255,255,255,.65)' }}>{p.name}:</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>
            {new Intl.NumberFormat('pt-AO').format(p.value)} Kz
          </span>
        </div>
      ))}
    </div>
  )
}

export function BarChartWidget({ data, dataKey, nameKey = 'mes', color = '#7c3aed', height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBar data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barCategoryGap="32%">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 4" stroke="rgba(255,255,255,.06)" vertical={false} />
        <XAxis dataKey={nameKey} tick={{ fontSize: 11, fill: 'rgba(200,210,255,.45)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'rgba(200,210,255,.45)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill="url(#barGrad)" radius={[5, 5, 0, 0]} maxBarSize={36} name="Valor" />
      </ReBar>
    </ResponsiveContainer>
  )
}
