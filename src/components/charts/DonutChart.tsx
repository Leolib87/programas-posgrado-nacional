import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { chartPalette } from './colors';
import { useIsDark } from '../../lib/useTheme';

interface Props {
  title: string;
  counts: Record<string, number>;
  colorMapKey: 'modalidadColor' | 'tipoColor';
}

export default function DonutChart({ title, counts, colorMapKey }: Props) {
  const isDark = useIsDark();
  const { ink, ...palette } = chartPalette(isDark);
  const colorMap = palette[colorMapKey];
  const [hovered, setHovered] = useState<string | null>(null);
  const size = 220;
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
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
        <p className="text-base text-[var(--text-muted)]">Sin datos para el filtro actual.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">{title}</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title} className="shrink-0">
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
            <li
              key={key}
              className="flex items-center gap-2 cursor-default"
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              style={{ opacity: hovered && hovered !== key ? 0.4 : 1 }}
            >
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
