import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { ProgramaDoctorado } from '../../types';
import { chartPalette } from './colors';
import { useIsDark } from '../../lib/useTheme';

const clp = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;

export default function ScatterDuracionArancel({ data }: { data: ProgramaDoctorado[] }) {
  const isDark = useIsDark();
  const { ink, modalidadColor } = chartPalette(isDark);
  const [hovered, setHovered] = useState<string | null>(null);
  const width = 720;
  const height = 360;
  const margin = { top: 12, right: 16, bottom: 44, left: 68 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const rows = useMemo(() => data.filter((d) => d.arancelAnual !== null), [data]);

  const x = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([2, (d3.max(rows, (d) => d.duracionSemestres) ?? 8) + 1])
        .range([0, innerW]),
    [rows, innerW],
  );
  const y = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, (d3.max(rows, (d) => d.arancelAnual ?? 0) ?? 1) * 1.05])
        .nice()
        .range([innerH, 0]),
    [rows, innerH],
  );

  if (rows.length === 0) {
    return <p className="text-base text-[var(--text-muted)]">No hay programas con datos suficientes para el filtro actual.</p>;
  }

  const xTicks = x.ticks(6);
  const yTicks = y.ticks(5);

  return (
    <div className="overflow-x-auto">
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Duración vs arancel anual" className="max-w-none">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={0} x2={innerW} y1={y(t)} y2={y(t)} stroke={ink.grid} strokeWidth={1} />
            <text x={-10} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={12} fill={ink.muted}>
              {clp(t)}
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
          Duración (semestres)
        </text>

        {rows.map((d) => {
          const isHovered = hovered === d.id;
          return (
            <circle
              key={d.id}
              cx={x(d.duracionSemestres)}
              cy={y(d.arancelAnual ?? 0)}
              r={isHovered ? 9 : 7}
              fill={modalidadColor[d.modalidad] ?? ink.muted}
              fillOpacity={hovered && !isHovered ? 0.35 : 0.85}
              stroke={ink.surface}
              strokeWidth={2}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>{`${d.universidad}\n${d.duracionSemestres} semestres · ${clp(d.arancelAnual ?? 0)}/año · ${d.modalidad}`}</title>
            </circle>
          );
        })}
      </g>
    </svg>
    </div>
  );
}
