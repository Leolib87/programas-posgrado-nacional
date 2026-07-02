import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { INK } from './colors';

interface Props {
  title: string;
  counts: Record<string, number>;
  colorMap: Record<string, string>;
}

export default function DonutChart({ title, counts, colorMap }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const size = 200;
  const radius = size / 2;
  const entries = useMemo(
    () => Object.entries(counts).filter(([, v]) => v > 0),
    [counts],
  );
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  const pie = useMemo(
    () =>
      d3
        .pie<[string, number]>()
        .value(([, v]) => v)
        .sort(null)(entries),
    [entries],
  );

  const arc = d3
    .arc<d3.PieArcDatum<[string, number]>>()
    .innerRadius(radius * 0.6)
    .outerRadius(radius - 2)
    .cornerRadius(3)
    .padAngle(0.015);

  if (total === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-ink-900 mb-2">{title}</h3>
        <p className="text-sm text-ink-500">Sin datos para el filtro actual.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-ink-900 mb-2">{title}</h3>
      <div className="flex items-center gap-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title}>
          <g transform={`translate(${radius},${radius})`}>
            {pie.map((slice) => {
              const [key, value] = slice.data;
              const isHovered = hovered === key;
              return (
                <path
                  key={key}
                  d={arc(slice) ?? undefined}
                  fill={colorMap[key] ?? INK.muted}
                  opacity={hovered && !isHovered ? 0.4 : 1}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <title>{`${key}: ${value} (${Math.round((value / total) * 100)}%)`}</title>
                </path>
              );
            })}
            <text textAnchor="middle" dominantBaseline="middle" y={-4} fontSize={20} fontWeight={700} fill={INK.primary}>
              {total}
            </text>
            <text textAnchor="middle" dominantBaseline="middle" y={16} fontSize={11} fill={INK.muted}>
              programas
            </text>
          </g>
        </svg>
        <ul className="flex flex-col gap-1.5 text-sm">
          {entries.map(([key, value]) => (
            <li
              key={key}
              className="flex items-center gap-2 cursor-default"
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              style={{ opacity: hovered && hovered !== key ? 0.4 : 1 }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorMap[key] ?? INK.muted }} />
              <span className="text-ink-700">{key}</span>
              <span className="text-ink-500 tabular-nums">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
