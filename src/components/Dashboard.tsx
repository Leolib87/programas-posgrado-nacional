import { useMemo, useState } from 'react';
import type { ProgramaDoctorado } from '../types';
import FilterPanel from './FilterPanel';
import ProgramCard from './ProgramCard';
import ChartsPanel from './charts/ChartsPanel';

export default function Dashboard({ programas }: { programas: ProgramaDoctorado[] }) {
  const arancelValues = programas.map((p) => p.arancelAnual).filter((v): v is number => v !== null);
  const bounds: [number, number] = [
    arancelValues.length ? Math.min(...arancelValues) : 0,
    arancelValues.length ? Math.max(...arancelValues) : 1,
  ];

  const modalidades = useMemo(
    () => Array.from(new Set(programas.map((p) => p.modalidad))).sort(),
    [programas],
  );
  const tipos = useMemo(() => Array.from(new Set(programas.map((p) => p.tipoInstitucion))).sort(), [programas]);
  const regiones = useMemo(() => Array.from(new Set(programas.map((p) => p.region))).sort(), [programas]);

  const [arancelRange, setArancelRange] = useState<[number, number]>(bounds);
  const [activeModalidades, setActiveModalidades] = useState(new Set(modalidades));
  const [activeTipos, setActiveTipos] = useState(new Set(tipos));
  const [activeRegiones, setActiveRegiones] = useState(new Set(regiones));

  const toggle = (set: Set<string>, value: string) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  const filtered = useMemo(
    () =>
      programas.filter((p) => {
        const arancelOk = p.arancelAnual === null || (p.arancelAnual >= arancelRange[0] && p.arancelAnual <= arancelRange[1]);
        return (
          arancelOk &&
          activeModalidades.has(p.modalidad) &&
          activeTipos.has(p.tipoInstitucion) &&
          activeRegiones.has(p.region)
        );
      }),
    [programas, arancelRange, activeModalidades, activeTipos, activeRegiones],
  );

  const resetFilters = () => {
    setArancelRange(bounds);
    setActiveModalidades(new Set(modalidades));
    setActiveTipos(new Set(tipos));
    setActiveRegiones(new Set(regiones));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
      <FilterPanel
        data={programas}
        arancelBounds={bounds}
        arancelRange={arancelRange}
        onArancelChange={setArancelRange}
        modalidades={modalidades}
        activeModalidades={activeModalidades}
        onToggleModalidad={(m) => setActiveModalidades((s) => toggle(s, m))}
        tipos={tipos}
        activeTipos={activeTipos}
        onToggleTipo={(t) => setActiveTipos((s) => toggle(s, t))}
        regiones={regiones}
        activeRegiones={activeRegiones}
        onToggleRegion={(r) => setActiveRegiones((s) => toggle(s, r))}
        onReset={resetFilters}
      />

      <div className="flex flex-col gap-6">
        <p className="text-sm text-ink-500">
          <span className="font-semibold text-ink-900">{filtered.length}</span> de {programas.length} programas
        </p>

        <ChartsPanel data={filtered} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProgramCard key={p.id} p={p} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-ink-500 col-span-full">Ningún programa coincide con los filtros seleccionados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
