import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { ProgramaDoctorado } from '../../types';
import { chartPalette } from './colors';
import { useIsDark } from '../../lib/useTheme';
import { useElementWidth } from '../../lib/useElementWidth';

const clp = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;

export default function BarChartArancel({ data }: { data: ProgramaDoctorado[] }) {
  const isDark = useIsDark();
  const { ink, sequentialBlue } = chartPalette(isDark);
  const [hovered, setHovered] = useState<string | null>(null);
  const { ref, width } = useElementWidth<HTMLDivElement>(680);
  const compact = width < 480;
  const rowHeight = compact ? 30 : 34;
  const margin = compact
    ? { top: 8, right: 44, bottom: 8, left: 128 }
    : { top: 8, right: 64, bottom: 8, left: 260 };
  const labelMax = compact ? 16 : 34;
  const labelFontSize = compact ? 11 : 14;
  const valueFontSize = compact ? 10 : 13;

  const rows = useMemo(
    () =>
      data
        .filter((d) => d.arancelAnual !== null)
        .sort((a, b) => (b.arancelAnual ?? 0) - (a.arancelAnual ?? 0)),
    [data],
  );

  const height = rows.length * rowHeight + margin.top + margin.bottom;
  const innerWidth = Math.max(width - margin.left - margin.right, 40);

  const x = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(rows, (d) => d.arancelAnual ?? 0) ?? 1])
        .nice()
        .range([0, innerWidth]),
    [rows, innerWidth],
  );

  const colorScale = useMemo(
    () =>
      d3
        .scaleQuantize<string>()
        .domain([0, d3.max(rows, (d) => d.arancelAnual ?? 0) ?? 1])
        .range(sequentialBlue),
    [rows, sequentialBlue],
  );

  if (rows.length === 0) {
    return <p className="text-base text-[var(--text-muted)]">No hay programas con arancel informado en el filtro actual.</p>;
  }

  const ticks = x.ticks(compact ? 3 : 4);

  return (
    <div ref={ref}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Arancel anual por universidad">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {ticks.map((t) => (
            <line key={t} x1={x(t)} x2={x(t)} y1={-4} y2={rows.length * rowHeight} stroke={ink.grid} strokeWidth={1} />
          ))}
          {rows.map((d, i) => {
            const w = x(d.arancelAnual ?? 0);
            const isHovered = hovered === d.id;
            return (
              <g
                key={d.id}
                transform={`translate(0,${i * rowHeight})`}
                onMouseEnter={() => setHovered(d.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <text
                  x={-10}
                  y={rowHeight / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={labelFontSize}
                  fill={isHovered ? ink.primary : ink.secondary}
                  fontWeight={isHovered ? 600 : 400}
                >
                  {d.universidad.length > labelMax ? d.universidad.slice(0, labelMax - 2) + '…' : d.universidad}
                </text>
                <rect
                  x={0}
                  y={(rowHeight - 18) / 2}
                  width={Math.max(w, 2)}
                  height={18}
                  rx={4}
                  fill={colorScale(d.arancelAnual ?? 0)}
                  opacity={isHovered ? 1 : 0.85}
                >
                  <title>{`${d.universidad}: ${clp(d.arancelAnual ?? 0)}/año`}</title>
                </rect>
                <text x={w + 8} y={rowHeight / 2} dominantBaseline="middle" fontSize={valueFontSize} fill={ink.secondary} className="tabular-nums">
                  {clp(d.arancelAnual ?? 0)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
