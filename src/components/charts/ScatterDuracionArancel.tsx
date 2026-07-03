import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { ProgramaDoctorado } from '../../types';
import { chartPalette } from './colors';
import { useIsDark } from '../../lib/useTheme';
import { useElementWidth } from '../../lib/useElementWidth';

const clp = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;

export default function ScatterDuracionArancel({ data }: { data: ProgramaDoctorado[] }) {
  const isDark = useIsDark();
  const { ink, modalidadColor } = chartPalette(isDark);
  const [hovered, setHovered] = useState<string | null>(null);
  const { ref, width } = useElementWidth<HTMLDivElement>(680);
  const compact = width < 480;
  const height = compact ? 300 : 360;
  const margin = compact ? { top: 12, right: 12, bottom: 40, left: 48 } : { top: 12, right: 16, bottom: 44, left: 68 };
  const tickFontSize = compact ? 10 : 12;
  const innerW = Math.max(width - margin.left - margin.right, 40);
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

  const xTicks = x.ticks(compact ? 4 : 6);
  const yTicks = y.ticks(compact ? 4 : 5);

  return (
    <div ref={ref}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Duración vs arancel anual">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={0} x2={innerW} y1={y(t)} y2={y(t)} stroke={ink.grid} strokeWidth={1} />
              <text x={-8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize={tickFontSize} fill={ink.muted}>
                {clp(t)}
              </text>
            </g>
          ))}
          {xTicks.map((t) => (
            <text key={t} x={x(t)} y={innerH + (compact ? 20 : 24)} textAnchor="middle" fontSize={tickFontSize} fill={ink.muted}>
              {t}
            </text>
          ))}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH} stroke={ink.baseline} strokeWidth={1} />
          <text x={innerW / 2} y={innerH + (compact ? 34 : 40)} textAnchor="middle" fontSize={compact ? 11 : 13} fill={ink.secondary}>
            Duración (semestres)
          </text>

          {rows.map((d) => {
            const isHovered = hovered === d.id;
            return (
              <circle
                key={d.id}
                cx={x(d.duracionSemestres)}
                cy={y(d.arancelAnual ?? 0)}
                r={isHovered ? 9 : compact ? 6 : 7}
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
