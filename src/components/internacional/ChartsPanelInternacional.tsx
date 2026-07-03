import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { ProgramaInternacional } from '../../types-internacional';
import { chartPalette, CATEGORICAL_LIGHT, CATEGORICAL_DARK } from '../charts/colors';
import { useIsDark } from '../../lib/useTheme';
import { toUsdApprox } from '../../lib/usdApprox';

function usd(n: number) {
  return `$${(n / 1000).toFixed(1)}k`;
}

function CostBarChart({ data }: { data: ProgramaInternacional[] }) {
  const isDark = useIsDark();
  const { ink, sequentialBlue } = chartPalette(isDark);
  const [hovered, setHovered] = useState<string | null>(null);
  const width = 720;
  const rowHeight = 34;
  const margin = { top: 8, right: 64, bottom: 8, left: 280 };

  const rows = useMemo(() => {
    return data
      .map((d) => ({ ...d, costUsd: d.costoTotal !== null ? toUsdApprox(d.costoTotal, d.moneda) : null }))
      .filter((d) => d.costUsd !== null)
      .sort((a, b) => (b.costUsd ?? 0) - (a.costUsd ?? 0));
  }, [data]);

  const innerWidth = width - margin.left - margin.right;
  const height = rows.length * rowHeight + margin.top + margin.bottom;

  const x = useMemo(
    () => d3.scaleLinear().domain([0, d3.max(rows, (d) => d.costUsd ?? 0) ?? 1]).nice().range([0, innerWidth]),
    [rows, innerWidth],
  );
  const colorScale = useMemo(
    () => d3.scaleQuantize<string>().domain([0, d3.max(rows, (d) => d.costUsd ?? 0) ?? 1]).range(sequentialBlue),
    [rows, sequentialBlue],
  );

  if (rows.length === 0) {
    return <p className="text-base text-[var(--text-muted)]">No hay programas con costo informado en el filtro actual.</p>;
  }

  const ticks = x.ticks(4);

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Costo total aproximado por universidad">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {ticks.map((t) => (
          <line key={t} x1={x(t)} x2={x(t)} y1={-4} y2={rows.length * rowHeight} stroke={ink.grid} strokeWidth={1} />
        ))}
        {rows.map((d, i) => {
          const w = x(d.costUsd ?? 0);
          const isHovered = hovered === d.id;
          return (
            <g key={d.id} transform={`translate(0,${i * rowHeight})`} onMouseEnter={() => setHovered(d.id)} onMouseLeave={() => setHovered(null)}>
              <text x={-10} y={rowHeight / 2} textAnchor="end" dominantBaseline="middle" fontSize={14} fill={isHovered ? ink.primary : ink.secondary} fontWeight={isHovered ? 600 : 400}>
                {d.universidad.length > 38 ? d.universidad.slice(0, 36) + '…' : d.universidad}
              </text>
              <rect x={0} y={(rowHeight - 18) / 2} width={Math.max(w, 2)} height={18} rx={4} fill={colorScale(d.costUsd ?? 0)} opacity={isHovered ? 1 : 0.85}>
                <title>{`${d.universidad}: ${usd(d.costUsd ?? 0)} USD aprox.`}</title>
              </rect>
              <text x={w + 8} y={rowHeight / 2} dominantBaseline="middle" fontSize={13} fill={ink.secondary} className="tabular-nums">
                {usd(d.costUsd ?? 0)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function ScatterCosto({ data }: { data: ProgramaInternacional[] }) {
  const isDark = useIsDark();
  const { ink } = chartPalette(isDark);
  const categorical = isDark ? CATEGORICAL_DARK : CATEGORICAL_LIGHT;
  const [hovered, setHovered] = useState<string | null>(null);
  const width = 720;
  const height = 360;
  const margin = { top: 12, right: 16, bottom: 44, left: 68 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const paisColor = useMemo(() => {
    const paises = Array.from(new Set(data.map((d) => d.pais)));
    const map: Record<string, string> = {};
    paises.forEach((p, i) => (map[p] = categorical[i % categorical.length]));
    return map;
  }, [data, categorical]);

  const rows = useMemo(
    () =>
      data
        .map((d) => ({ ...d, costUsd: d.costoTotal !== null ? toUsdApprox(d.costoTotal, d.moneda) : null }))
        .filter((d) => d.costUsd !== null && d.duracionAnios !== null),
    [data],
  );

  const x = useMemo(
    () => d3.scaleLinear().domain([1, (d3.max(rows, (d) => d.duracionAnios ?? 0) ?? 5) + 1]).range([0, innerW]),
    [rows, innerW],
  );
  const y = useMemo(
    () => d3.scaleLinear().domain([0, (d3.max(rows, (d) => d.costUsd ?? 0) ?? 1) * 1.05]).nice().range([innerH, 0]),
    [rows, innerH],
  );

  if (rows.length === 0) {
    return <p className="text-base text-[var(--text-muted)]">No hay programas con datos suficientes para el filtro actual.</p>;
  }

  const xTicks = x.ticks(5);
  const yTicks = y.ticks(5);

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Duración vs costo total aproximado">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={0} x2={innerW} y1={y(t)} y2={y(t)} stroke={ink.grid} strokeWidth={1} />
            <text x={-10} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={12} fill={ink.muted}>
              {usd(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={innerH + 24} textAnchor="middle" fontSize={12} fill={ink.muted}>
            {t}
          </text>
        ))}
        <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke={ink.baseline} strokeWidth={1} />
        <text x={innerW / 2} y={innerH + 40} textAnchor="middle" fontSize={13} fill={ink.secondary}>
          Duración (años)
        </text>
        {rows.map((d) => {
          const isHovered = hovered === d.id;
          return (
            <circle
              key={d.id}
              cx={x(d.duracionAnios ?? 0)}
              cy={y(d.costUsd ?? 0)}
              r={isHovered ? 9 : 7}
              fill={paisColor[d.pais] ?? ink.muted}
              fillOpacity={hovered && !isHovered ? 0.35 : 0.85}
              stroke={ink.surface}
              strokeWidth={2}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>{`${d.universidad}\n${d.duracionAnios} años · ${usd(d.costUsd ?? 0)} USD aprox. · ${d.pais}`}</title>
            </circle>
          );
        })}
      </g>
    </svg>
  );
}

export default function ChartsPanelInternacional({ data }: { data: ProgramaInternacional[] }) {
  const paisCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of data) counts[d.pais] = (counts[d.pais] ?? 0) + 1;
    return counts;
  }, [data]);

  const modalidadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of data) counts[d.modalidad] = (counts[d.modalidad] ?? 0) + 1;
    return counts;
  }, [data]);

  const isDark = useIsDark();
  const { modalidadColor } = chartPalette(isDark);
  const categorical = isDark ? CATEGORICAL_DARK : CATEGORICAL_LIGHT;
  const paisColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.keys(paisCounts).forEach((p, i) => (map[p] = categorical[i % categorical.length]));
    return map;
  }, [paisCounts, categorical]);

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Costo total por universidad (USD aprox.)</h3>
        <CostBarChart data={data} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6">
          <DonutChartGeneric title="Por país" counts={paisCounts} colorMap={paisColorMap} />
        </div>
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6">
          <DonutChartGeneric title="Por modalidad" counts={modalidadCounts} colorMap={modalidadColor} />
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Duración vs. costo total (USD aprox.)</h3>
        <ScatterCosto data={data} />
      </div>
    </section>
  );
}

function DonutChartGeneric({ title, counts, colorMap }: { title: string; counts: Record<string, number>; colorMap: Record<string, string> }) {
  const isDark = useIsDark();
  const { ink } = chartPalette(isDark);
  const [hovered, setHovered] = useState<string | null>(null);
  const size = 220;
  const radius = size / 2;
  const entries = useMemo(() => Object.entries(counts).filter(([, v]) => v > 0), [counts]);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  const pie = useMemo(() => d3.pie<[string, number]>().value(([, v]) => v).sort(null)(entries), [entries]);
  const arc = d3.arc<d3.PieArcDatum<[string, number]>>().innerRadius(radius * 0.6).outerRadius(radius - 2).cornerRadius(3).padAngle(0.015);

  if (total === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
        <p className="text-base text-[var(--text-muted)]">Sin datos para el filtro actual.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">{title}</h3>
      <div className="flex items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title}>
          <g transform={`translate(${radius},${radius})`}>
            {pie.map((slice) => {
              const [key, value] = slice.data;
              const isHovered = hovered === key;
              return (
                <path
                  key={key}
                  d={arc(slice) ?? undefined}
                  fill={colorMap[key] ?? ink.muted}
                  opacity={hovered && !isHovered ? 0.4 : 1}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <title>{`${key}: ${value} (${Math.round((value / total) * 100)}%)`}</title>
                </path>
              );
            })}
            <text textAnchor="middle" dominantBaseline="middle" y={-6} fontSize={24} fontWeight={700} fill={ink.primary}>
              {total}
            </text>
            <text textAnchor="middle" dominantBaseline="middle" y={16} fontSize={13} fill={ink.muted}>
              programas
            </text>
          </g>
        </svg>
        <ul className="flex flex-col gap-2 text-base">
          {entries.map(([key, value]) => (
            <li key={key} className="flex items-center gap-2 cursor-default" onMouseEnter={() => setHovered(key)} onMouseLeave={() => setHovered(null)} style={{ opacity: hovered && hovered !== key ? 0.4 : 1 }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap[key] ?? ink.muted }} />
              <span className="text-[var(--text-secondary)]">{key}</span>
              <span className="text-[var(--text-muted)] tabular-nums">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
