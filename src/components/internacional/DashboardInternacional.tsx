import { useMemo, useState } from 'react';
import type { ProgramaInternacional } from '../../types-internacional';
import FilterPanelInternacional from './FilterPanelInternacional';
import ProgramCardInternacional from './ProgramCardInternacional';
import ChartsPanelInternacional from './ChartsPanelInternacional';
import { toUsdApprox } from '../../lib/usdApprox';

export default function DashboardInternacional({ programas }: { programas: ProgramaInternacional[] }) {
  const costUsdById = useMemo(() => {
    const map: Record<string, number | null> = {};
    for (const p of programas) map[p.id] = p.costoTotal !== null ? toUsdApprox(p.costoTotal, p.moneda) : null;
    return map;
  }, [programas]);

  const costValues = Object.values(costUsdById).filter((v): v is number => v !== null);
  const bounds: [number, number] = [costValues.length ? Math.min(...costValues) : 0, costValues.length ? Math.max(...costValues) : 1];

  const paises = useMemo(() => Array.from(new Set(programas.map((p) => p.pais))).sort(), [programas]);
  const modalidades = useMemo(() => Array.from(new Set(programas.map((p) => p.modalidad))).sort(), [programas]);
  const tipos = useMemo(() => Array.from(new Set(programas.map((p) => p.tipoInstitucion))).sort(), [programas]);

  const [costoRange, setCostoRange] = useState<[number, number]>(bounds);
  const [activePaises, setActivePaises] = useState(new Set(paises));
  const [activeModalidades, setActiveModalidades] = useState(new Set(modalidades));
  const [activeTipos, setActiveTipos] = useState(new Set(tipos));

  const toggle = (set: Set<string>, value: string) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  const filtered = useMemo(
    () =>
      programas.filter((p) => {
        const cost = costUsdById[p.id];
        const costoOk = cost === null || (cost >= costoRange[0] && cost <= costoRange[1]);
        return costoOk && activePaises.has(p.pais) && activeModalidades.has(p.modalidad) && activeTipos.has(p.tipoInstitucion);
      }),
    [programas, costUsdById, costoRange, activePaises, activeModalidades, activeTipos],
  );

  const resetFilters = () => {
    setCostoRange(bounds);
    setActivePaises(new Set(paises));
    setActiveModalidades(new Set(modalidades));
    setActiveTipos(new Set(tipos));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
      <FilterPanelInternacional
        costoBounds={bounds}
        costoRange={costoRange}
        onCostoChange={setCostoRange}
        paises={paises}
        activePaises={activePaises}
        onTogglePais={(p) => setActivePaises((s) => toggle(s, p))}
        modalidades={modalidades}
        activeModalidades={activeModalidades}
        onToggleModalidad={(m) => setActiveModalidades((s) => toggle(s, m))}
        tipos={tipos}
        activeTipos={activeTipos}
        onToggleTipo={(t) => setActiveTipos((s) => toggle(s, t))}
        onReset={resetFilters}
      />

      <div className="flex flex-col gap-8">
        <p className="text-base text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-primary)]">{filtered.length}</span> de {programas.length} programas
        </p>

        <ChartsPanelInternacional data={filtered} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProgramCardInternacional key={p.id} p={p} />
          ))}
          {filtered.length === 0 && (
            <p className="text-base text-[var(--text-muted)] col-span-full">Ningún programa coincide con los filtros seleccionados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
