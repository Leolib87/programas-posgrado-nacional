import type { ProgramaDoctorado } from '../types';

interface Props {
  data: ProgramaDoctorado[];
  arancelBounds: [number, number];
  arancelRange: [number, number];
  onArancelChange: (range: [number, number]) => void;
  modalidades: string[];
  activeModalidades: Set<string>;
  onToggleModalidad: (m: string) => void;
  tipos: string[];
  activeTipos: Set<string>;
  onToggleTipo: (t: string) => void;
  regiones: string[];
  activeRegiones: Set<string>;
  onToggleRegion: (r: string) => void;
  onReset: () => void;
}

const clp = (n: number) => `$${n.toLocaleString('es-CL')}`;

export default function FilterPanel({
  arancelBounds,
  arancelRange,
  onArancelChange,
  modalidades,
  activeModalidades,
  onToggleModalidad,
  tipos,
  activeTipos,
  onToggleTipo,
  regiones,
  activeRegiones,
  onToggleRegion,
  onReset,
}: Props) {
  const [boundMin, boundMax] = arancelBounds;
  const [rangeMin, rangeMax] = arancelRange;

  const handleMin = (value: number) => {
    onArancelChange([Math.min(value, rangeMax), rangeMax]);
  };
  const handleMax = (value: number) => {
    onArancelChange([rangeMin, Math.max(value, rangeMin)]);
  };

  return (
    <aside className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-6 h-fit sticky top-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-900 uppercase tracking-wide">Filtros</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          Limpiar
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-ink-700 uppercase tracking-wide">
          Arancel anual (CLP)
        </label>
        <div className="text-sm text-ink-500 flex justify-between tabular-nums">
          <span>{clp(rangeMin)}</span>
          <span>{clp(rangeMax)}</span>
        </div>
        <div className="relative h-6">
          <input
            type="range"
            className="range-slider absolute w-full top-1/2 -translate-y-1/2"
            min={boundMin}
            max={boundMax}
            step={100000}
            value={rangeMin}
            onChange={(e) => handleMin(Number(e.target.value))}
            aria-label="Arancel mínimo"
          />
          <input
            type="range"
            className="range-slider absolute w-full top-1/2 -translate-y-1/2"
            min={boundMin}
            max={boundMax}
            step={100000}
            value={rangeMax}
            onChange={(e) => handleMax(Number(e.target.value))}
            aria-label="Arancel máximo"
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs font-semibold text-ink-700 uppercase tracking-wide mb-1">
          Modalidad
        </legend>
        {modalidades.map((m) => (
          <label key={m} className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
            <input
              type="checkbox"
              checked={activeModalidades.has(m)}
              onChange={() => onToggleModalidad(m)}
              className="accent-brand-500 w-4 h-4"
            />
            {m}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs font-semibold text-ink-700 uppercase tracking-wide mb-1">
          Tipo de institución
        </legend>
        {tipos.map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
            <input
              type="checkbox"
              checked={activeTipos.has(t)}
              onChange={() => onToggleTipo(t)}
              className="accent-brand-500 w-4 h-4"
            />
            {t}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs font-semibold text-ink-700 uppercase tracking-wide mb-1">
          Región
        </legend>
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {regiones.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                checked={activeRegiones.has(r)}
                onChange={() => onToggleRegion(r)}
                className="accent-brand-500 w-4 h-4"
              />
              {r}
            </label>
          ))}
        </div>
      </fieldset>
    </aside>
  );
}
