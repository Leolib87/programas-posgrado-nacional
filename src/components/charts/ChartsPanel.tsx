import { useMemo } from 'react';
import type { ProgramaDoctorado } from '../../types';
import BarChartArancel from './BarChartArancel';
import DonutChart from './DonutChart';
import ScatterDuracionArancel from './ScatterDuracionArancel';
import { MODALIDAD_COLOR, TIPO_COLOR } from './colors';

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
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-4">Arancel anual por universidad</h3>
        <BarChartArancel data={data} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <DonutChart title="Por modalidad" counts={modalidadCounts} colorMap={MODALIDAD_COLOR} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <DonutChart title="Por tipo de institución" counts={tipoCounts} colorMap={TIPO_COLOR} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-4">Duración vs. arancel anual</h3>
        <ScatterDuracionArancel data={data} />
      </div>
    </section>
  );
}
