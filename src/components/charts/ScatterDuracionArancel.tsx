import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { ProgramaDoctorado } from '../../types';
import { INK, MODALIDAD_COLOR } from './colors';

const clp = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;

export default function ScatterDuracionArancel({ data }: { data: ProgramaDoctorado[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const width = 640;
  const height = 320;
  const margin = { top: 12, right: 16, bottom: 36, left: 56 };
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
    return <p className="text-sm text-ink-500">No hay programas con datos suficientes para el filtro actual.</p>;
  }

  const xTicks = x.ticks(6);
  const yTicks = y.ticks(5);

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Duración vs arancel anual">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={0} x2={innerW} y1={y(t)} y2={y(t)} stroke={INK.grid} strokeWidth={1} />
            <text x={-8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill={INK.muted}>
              {clp(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={innerH + 20} textAnchor="middle" fontSize={10} fill={INK.muted}>
            {t}
          </text>
        ))}
        <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke={INK.baseline} strokeWidth={1} />
        <text x={innerW / 2} y={innerH + 34} textAnchor="middle" fontSize={11} fill={INK.secondary}>
          Duración (semestres)
        </text>

        {rows.map((d) => {
          const isHovered = hovered === d.id;
          return (
            <circle
              key={d.id}
              cx={x(d.duracionSemestres)}
              cy={y(d.arancelAnual ?? 0)}
              r={isHovered ? 8 : 6}
              fill={MODALIDAD_COLOR[d.modalidad] ?? INK.muted}
              fillOpacity={hovered && !isHovered ? 0.35 : 0.85}
              stroke={INK.surface}
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
  );
}
