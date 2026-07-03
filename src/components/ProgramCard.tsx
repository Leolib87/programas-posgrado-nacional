import type { ProgramaDoctorado } from '../types';

const clp = (n: number | null) => (n === null ? 'No informado' : `$${n.toLocaleString('es-CL')}`);

const modalidadStyles: Record<string, string> = {
  Presencial: 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-300',
  Online: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Híbrida: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
};

export default function ProgramCard({ p }: { p: ProgramaDoctorado }) {
  return (
    <article className="bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-6 flex flex-col gap-3.5 hover:border-brand-300 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-lg text-[var(--text-primary)] leading-snug">{p.universidad}</h3>
        <span className={`text-sm font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${modalidadStyles[p.modalidad] ?? 'bg-slate-100 text-[var(--text-secondary)]'}`}>
          {p.modalidad}
        </span>
      </div>

      <div className="text-base text-[var(--text-muted)]">{p.ciudad} · {p.region} · {p.tipoInstitucion}</div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-base mt-1">
        <div>
          <dt className="text-[var(--text-muted)] text-sm">Arancel anual</dt>
          <dd className="font-medium text-[var(--text-primary)] tabular-nums">{clp(p.arancelAnual)}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-muted)] text-sm">Matrícula</dt>
          <dd className="font-medium text-[var(--text-primary)] tabular-nums">{clp(p.matricula)}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-muted)] text-sm">Duración</dt>
          <dd className="font-medium text-[var(--text-primary)]">{p.duracionSemestres ? `${p.duracionSemestres} semestres` : 'No informado'}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-muted)] text-sm">Jornada</dt>
          <dd className="font-medium text-[var(--text-primary)]">{p.jornada}</dd>
        </div>
      </dl>

      {p.acreditadoHasta && (
        <div className="text-sm text-[var(--text-muted)]">Acreditado hasta {p.acreditadoHasta}</div>
      )}

      <a
        href={p.urlPrograma}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-base font-medium text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
      >
        Ver programa →
      </a>
    </article>
  );
}
