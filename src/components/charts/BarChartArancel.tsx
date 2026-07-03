import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import type { ProgramaDoctorado } from '../../types';
import { chartPalette } from './colors';
import { useIsDark } from '../../lib/useTheme';

const clp = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;

export default function BarChartArancel({ data }: { data: ProgramaDoctorado[] }) {
  const isDark = useIsDark();
  const { ink, sequentialBlue } = chartPalette(isDark);
  const [hovered, setHovered] = useState<string | null>(null);
  const width = 720;
  const rowHeight = 34;
  const margin = { top: 8, right: 64, bottom: 8, left: 260 };

  const rows = useMemo(
    () =>
      data
        .filter((d) => d.arancelAnual !== null)
        .sort((a, b) => (b.arancelAnual ?? 0) - (a.arancelAnual ?? 0)),
    [data],
  );

  const height = rows.length * rowHeight + margin.top + margin.bottom;
  const innerWidth = width - margin.left - margin.right;

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

  const ticks = x.ticks(4);

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Arancel anual por universidad">
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
                fontSize={14}
                fill={isHovered ? ink.primary : ink.secondary}
                fontWeight={isHovered ? 600 : 400}
              >
                {d.universidad.length > 34 ? d.universidad.slice(0, 32) + '…' : d.universidad}
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
              <text x={w + 8} y={rowHeight / 2} dominantBaseline="middle" fontSize={13} fill={ink.secondary} className="tabular-nums">
                {clp(d.arancelAnual ?? 0)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
