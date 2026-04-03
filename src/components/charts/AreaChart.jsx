import {
  AreaChart as ReArea, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
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
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'rgba(255,255,255,.65)' }}>{p.name}:</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>
            {new Intl.NumberFormat('pt-AO').format(p.value)} Kz
          </span>
        </div>
      ))}
    </div>
  )
}

export function AreaChartWidget({ data, series, height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReArea data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <defs>
          {series.map(s => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={s.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0}    />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 4" stroke="rgba(255,255,255,.06)" vertical={false} />
        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'rgba(200,210,255,.45)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'rgba(200,210,255,.45)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
        <Tooltip content={<CustomTooltip />} />
        {series.map(s => (
          <Area
            key={s.key} type="monotone" dataKey={s.key} name={s.label}
            stroke={s.color} strokeWidth={2}
            fill={`url(#grad-${s.key})`}
            dot={false} activeDot={{ r: 4, fill: s.color, stroke: 'rgba(255,255,255,.3)', strokeWidth: 2 }}
          />
        ))}
      </ReArea>
    </ResponsiveContainer>
  )
}
