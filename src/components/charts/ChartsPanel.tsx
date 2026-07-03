import { useMemo } from 'react';
import type { ProgramaDoctorado } from '../../types';
import BarChartArancel from './BarChartArancel';
import DonutChart from './DonutChart';
import ScatterDuracionArancel from './ScatterDuracionArancel';

export default function ChartsPanel({ data }: { data: ProgramaDoctorado[] }) {
  const modalidadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of data) counts[d.modalidad] = (counts[d.modalidad] ?? 0) + 1;
    return counts;
  }, [data]);

  const tipoCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of data) counts[d.tipoInstitucion] = (counts[d.tipoInstitucion] ?? 0) + 1;
    return counts;
  }, [data]);

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Arancel anual por universidad</h3>
        <BarChartArancel data={data} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6">
          <DonutChart title="Por modalidad" counts={modalidadCounts} colorMapKey="modalidadColor" />
        </div>
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6">
          <DonutChart title="Por tipo de institución" counts={tipoCounts} colorMapKey="tipoColor" />
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Duración vs. arancel anual</h3>
        <ScatterDuracionArancel data={data} />
      </div>
    </section>
  );
}
