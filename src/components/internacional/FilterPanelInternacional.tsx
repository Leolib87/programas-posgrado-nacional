const clp = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

interface Props {
  costoBounds: [number, number];
  costoRange: [number, number];
  onCostoChange: (range: [number, number]) => void;
  paises: string[];
  activePaises: Set<string>;
  onTogglePais: (p: string) => void;
  modalidades: string[];
  activeModalidades: Set<string>;
  onToggleModalidad: (m: string) => void;
  tipos: string[];
  activeTipos: Set<string>;
  onToggleTipo: (t: string) => void;
  onReset: () => void;
}

export default function FilterPanelInternacional({
  costoBounds,
  costoRange,
  onCostoChange,
  paises,
  activePaises,
  onTogglePais,
  modalidades,
  activeModalidades,
  onToggleModalidad,
  tipos,
  activeTipos,
  onToggleTipo,
  onReset,
}: Props) {
  const [boundMin, boundMax] = costoBounds;
  const [rangeMin, rangeMax] = costoRange;

  const handleMin = (value: number) => onCostoChange([Math.min(value, rangeMax), rangeMax]);
  const handleMax = (value: number) => onCostoChange([rangeMin, Math.max(value, rangeMin)]);

  return (
    <aside className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6 flex flex-col gap-7 h-fit sticky top-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--text-primary)] uppercase tracking-wide">Filtros</h2>
        <button type="button" onClick={onReset} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
          Limpiar
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Costo total (USD aprox.)
        </label>
        <p className="text-xs text-[var(--text-muted)] -mt-1">
          Conversión aproximada solo para comparar entre países, no es un tipo de cambio oficial.
        </p>
        <div className="text-base text-[var(--text-muted)] flex justify-between tabular-nums">
          <span>{clp(rangeMin)}</span>
          <span>{clp(rangeMax)}</span>
        </div>
        <div className="relative h-6">
          <input
            type="range"
            className="range-slider absolute w-full top-1/2 -translate-y-1/2"
            min={boundMin}
            max={boundMax}
            step={500}
            value={rangeMin}
            onChange={(e) => handleMin(Number(e.target.value))}
            aria-label="Costo mínimo"
          />
          <input
            type="range"
            className="range-slider absolute w-full top-1/2 -translate-y-1/2"
            min={boundMin}
            max={boundMax}
            step={500}
            value={rangeMax}
            onChange={(e) => handleMax(Number(e.target.value))}
            aria-label="Costo máximo"
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">País</legend>
        {paises.map((p) => (
          <label key={p} className="flex items-center gap-2.5 text-base text-[var(--text-secondary)] cursor-pointer">
            <input type="checkbox" checked={activePaises.has(p)} onChange={() => onTogglePais(p)} className="accent-brand-500 w-5 h-5" />
            {p}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">Modalidad</legend>
        {modalidades.map((m) => (
          <label key={m} className="flex items-center gap-2.5 text-base text-[var(--text-secondary)] cursor-pointer">
            <input type="checkbox" checked={activeModalidades.has(m)} onChange={() => onToggleModalidad(m)} className="accent-brand-500 w-5 h-5" />
            {m}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">Tipo de institución</legend>
        {tipos.map((t) => (
          <label key={t} className="flex items-center gap-2.5 text-base text-[var(--text-secondary)] cursor-pointer">
            <input type="checkbox" checked={activeTipos.has(t)} onChange={() => onToggleTipo(t)} className="accent-brand-500 w-5 h-5" />
            {t}
          </label>
        ))}
      </fieldset>
    </aside>
  );
}
