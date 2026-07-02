import type { ProgramaDoctorado } from '../types';

const clp = (n: number | null) => (n === null ? 'No informado' : `$${n.toLocaleString('es-CL')}`);

const modalidadStyles: Record<string, string> = {
  Presencial: 'bg-brand-50 text-brand-700',
  Online: 'bg-emerald-50 text-emerald-700',
  Híbrida: 'bg-amber-50 text-amber-700',
};

export default function ProgramCard({ p }: { p: ProgramaDoctorado }) {
  return (
    <article className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:border-brand-300 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-ink-900 leading-snug">{p.universidad}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${modalidadStyles[p.modalidad] ?? 'bg-slate-100 text-ink-700'}`}>
          {p.modalidad}
        </span>
      </div>

      <div className="text-sm text-ink-500">{p.ciudad} · {p.region} · {p.tipoInstitucion}</div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm mt-1">
        <div>
          <dt className="text-ink-500 text-xs">Arancel anual</dt>
          <dd className="font-medium text-ink-900 tabular-nums">{clp(p.arancelAnual)}</dd>
        </div>
        <div>
          <dt className="text-ink-500 text-xs">Matrícula</dt>
          <dd className="font-medium text-ink-900 tabular-nums">{clp(p.matricula)}</dd>
        </div>
        <div>
          <dt className="text-ink-500 text-xs">Duración</dt>
          <dd className="font-medium text-ink-900">{p.duracionSemestres} semestres</dd>
        </div>
        <div>
          <dt className="text-ink-500 text-xs">Jornada</dt>
          <dd className="font-medium text-ink-900">{p.jornada}</dd>
        </div>
      </dl>

      {p.acreditadoHasta && (
        <div className="text-xs text-ink-500">Acreditado hasta {p.acreditadoHasta}</div>
      )}

      <a
        href={p.urlPrograma}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-sm font-medium text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
      >
        Ver programa →
      </a>
    </article>
  );
}
